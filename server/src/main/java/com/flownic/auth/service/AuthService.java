package com.flownic.auth.service;

import com.flownic.auth.dto.AuthRequest;
import com.flownic.auth.dto.SignUpRequest;
import com.flownic.auth.model.Role;
import com.flownic.auth.model.User;
import com.flownic.auth.repository.UserRepository;
import com.flownic.auth.security.JwtUtil;
import io.jsonwebtoken.Claims;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
  private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtil jwtUtil;
  private final EmailService emailService;
  private final String clientBaseUrl;

  public AuthService(
      UserRepository userRepository,
      PasswordEncoder passwordEncoder,
      JwtUtil jwtUtil,
      EmailService emailService,
      @Value("${app.client.base-url}") String clientBaseUrl
  ) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtUtil = jwtUtil;
    this.emailService = emailService;
    this.clientBaseUrl = clientBaseUrl;
  }

  public void signUp(SignUpRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new IllegalArgumentException("Email already registered.");
    }

    User user = new User();
    user.setUsername(request.getUsername());
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRole(Role.USER);
    user.setVerified(false);

    User saved = userRepository.save(user);
    // Verification token is short-lived and only used for email confirmation.
    String verifyToken = jwtUtil.generateVerifyToken(saved.getEmail(), Map.of(
        "userId", saved.getId(),
        "purpose", "verify"
    ));
    String verifyUrl = clientBaseUrl + "/verify-email?token=" + verifyToken;
    // Send email asynchronously to avoid blocking signup response
    sendVerificationEmailAsync(saved.getEmail(), saved.getUsername(), verifyUrl);
  }

  @Async
  private void sendVerificationEmailAsync(String email, String userName, String verifyUrl) {
    try {
      emailService.sendVerificationEmail(email, userName, verifyUrl);
    } catch (RuntimeException ex) {
      logger.warn("Verification email failed. Signup already succeeded for {}.", email, ex);
    }
  }

  public String signIn(AuthRequest request) {
    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new IllegalArgumentException("Invalid credentials."));

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
      throw new IllegalArgumentException("Invalid credentials.");
    }

    if (!user.isVerified()) {
      throw new IllegalArgumentException("Please verify your email first.");
    }

    // Access token includes role for role-based access downstream.
    return jwtUtil.generateAuthToken(user.getEmail(), Map.of(
        "role", user.getRole().name(),
        "userId", user.getId()
    ));
  }

  public void verifyEmailToken(String token) {
    Claims claims = jwtUtil.parseVerifyToken(token);
    String userId = claims.get("userId", String.class);
    String purpose = claims.get("purpose", String.class);

    if (!"verify".equals(purpose)) {
      throw new IllegalArgumentException("Invalid verification token.");
    }

    User user = userRepository.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("User not found."));

    user.setVerified(true);
    user.setRole(Role.USER);
    userRepository.save(user);
  }

  public User getUserByEmail(String email) {
    return userRepository.findByEmail(email)
        .orElseThrow(() -> new IllegalArgumentException("User not found."));
  }
}

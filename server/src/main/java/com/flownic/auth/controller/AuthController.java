package com.flownic.auth.controller;

import com.flownic.auth.dto.ApiResponse;
import com.flownic.auth.dto.AuthRequest;
import com.flownic.auth.dto.SignUpRequest;
import com.flownic.auth.dto.UserResponse;
import com.flownic.auth.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final AuthService authService;
  private final String cookieName;
  private final boolean cookieSecure;

  public AuthController(
      AuthService authService,
      @Value("${app.jwt.cookie-name}") String cookieName,
      @Value("${app.jwt.cookie-secure}") boolean cookieSecure
  ) {
    this.authService = authService;
    this.cookieName = cookieName;
    this.cookieSecure = cookieSecure;
  }

  @PostMapping("/signup")
  public ResponseEntity<ApiResponse> signUp(@Valid @RequestBody SignUpRequest request) {
    authService.signUp(request);
    return ResponseEntity.ok(new ApiResponse(true, "Verification email sent"));
  }

  @GetMapping("/verify-email")
  public ResponseEntity<ApiResponse> verifyEmail(@RequestParam("token") String token) {
    authService.verifyEmailToken(token);
    return ResponseEntity.ok(new ApiResponse(true, "Email verified"));
  }

  @PostMapping("/signin")
  public ResponseEntity<ApiResponse> signIn(
      @Valid @RequestBody AuthRequest request,
      HttpServletResponse response
  ) {
    String jwt = authService.signIn(request);

    ResponseCookie cookie = ResponseCookie.from(cookieName, jwt)
        .httpOnly(true)
        .secure(cookieSecure)
        .path("/")
        .sameSite("Lax")
        .maxAge(60 * 60 * 24)
        .build();

    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    return ResponseEntity.ok(new ApiResponse(true, "Signed in"));
  }

  @PostMapping("/signout")
  public ResponseEntity<ApiResponse> signOut(HttpServletResponse response) {
    ResponseCookie cookie = ResponseCookie.from(cookieName, "")
        .httpOnly(true)
        .secure(cookieSecure)
        .path("/")
        .sameSite("Lax")
        .maxAge(0)
        .build();

    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    return ResponseEntity.ok(new ApiResponse(true, "Signed out"));
  }

  @GetMapping("/me")
  public ResponseEntity<UserResponse> me(@AuthenticationPrincipal UserDetails userDetails) {
    var user = authService.getUserByEmail(userDetails.getUsername());
    return ResponseEntity.ok(new UserResponse(
        user.getId(),
        user.getUsername(),
        user.getEmail(),
        user.getRole(),
        user.isVerified()
    ));
  }
}

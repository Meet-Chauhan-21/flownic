package com.flownic.auth.security;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import javax.crypto.SecretKey;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {
  private final SecretKey authSecretKey;
  private final SecretKey verifySecretKey;
  private final long authExpirationMs;
  private final long verifyExpirationMs;

  public JwtUtil(
      @Value("${app.jwt.secret}") String authSecret,
      @Value("${app.jwt.verify-secret}") String verifySecret,
      @Value("${app.jwt.expiration-ms}") long authExpirationMs,
      @Value("${app.jwt.verify-expiration-ms}") long verifyExpirationMs
  ) {
    this.authSecretKey = Keys.hmacShaKeyFor(authSecret.getBytes(StandardCharsets.UTF_8));
    this.verifySecretKey = Keys.hmacShaKeyFor(verifySecret.getBytes(StandardCharsets.UTF_8));
    this.authExpirationMs = authExpirationMs;
    this.verifyExpirationMs = verifyExpirationMs;
  }

  public String generateAuthToken(String subject, Map<String, Object> claims) {
    Instant now = Instant.now();
    return Jwts.builder()
        .setSubject(subject)
        .setIssuedAt(Date.from(now))
        .setExpiration(Date.from(now.plusMillis(authExpirationMs)))
        .addClaims(claims)
        .signWith(authSecretKey)
        .compact();
  }

  public String generateVerifyToken(String subject, Map<String, Object> claims) {
    Instant now = Instant.now();
    return Jwts.builder()
        .setSubject(subject)
        .setIssuedAt(Date.from(now))
        .setExpiration(Date.from(now.plusMillis(verifyExpirationMs)))
        .addClaims(claims)
        .signWith(verifySecretKey)
        .compact();
  }

  public Claims parseAuthToken(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(authSecretKey)
        .build()
        .parseClaimsJws(token)
        .getBody();
  }

  public Claims parseVerifyToken(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(verifySecretKey)
        .build()
        .parseClaimsJws(token)
        .getBody();
  }
}

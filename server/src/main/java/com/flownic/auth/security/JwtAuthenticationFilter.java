package com.flownic.auth.security;

import java.io.IOException;
import java.util.Collections;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
  private final JwtUtil jwtUtil;
  private final UserDetailsService userDetailsService;
  private final String cookieName;

  public JwtAuthenticationFilter(
      JwtUtil jwtUtil,
      UserDetailsService userDetailsService,
      @Value("${app.jwt.cookie-name}") String cookieName
  ) {
    this.jwtUtil = jwtUtil;
    this.userDetailsService = userDetailsService;
    this.cookieName = cookieName;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain
  ) throws ServletException, IOException {
    String token = extractTokenFromCookie(request);

    if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {
      try {
        Claims claims = jwtUtil.parseAuthToken(token);
        String email = claims.getSubject();
        var userDetails = userDetailsService.loadUserByUsername(email);
        var auth = new UsernamePasswordAuthenticationToken(
            userDetails,
            null,
            Collections.singleton(new SimpleGrantedAuthority("ROLE_" + claims.get("role")))
        );
        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(auth);
      } catch (Exception ex) {
        SecurityContextHolder.clearContext();
      }
    }

    filterChain.doFilter(request, response);
  }

  private String extractTokenFromCookie(HttpServletRequest request) {
    if (request.getCookies() == null) {
      return null;
    }
    for (Cookie cookie : request.getCookies()) {
      if (cookieName.equals(cookie.getName())) {
        return cookie.getValue();
      }
    }
    return null;
  }
}

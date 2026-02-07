package com.flownic.auth.dto;

import com.flownic.auth.model.Role;

public class UserResponse {
  private String id;
  private String username;
  private String email;
  private Role role;
  private boolean verified;

  public UserResponse(String id, String username, String email, Role role, boolean verified) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.role = role;
    this.verified = verified;
  }

  public String getId() {
    return id;
  }

  public String getUsername() {
    return username;
  }

  public String getEmail() {
    return email;
  }

  public Role getRole() {
    return role;
  }

  public boolean isVerified() {
    return verified;
  }
}

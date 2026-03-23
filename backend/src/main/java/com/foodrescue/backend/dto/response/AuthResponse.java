package com.foodrescue.backend.dto.response;

import com.foodrescue.backend.enums.Role;
import lombok.Builder;
import lombok.Data;

@Data @Builder
public class AuthResponse {
    private String token;
    private Long userId;
    private String name;
    private String email;
    private Role role;
    private Boolean verified;
}

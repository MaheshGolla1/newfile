package com.healthcare.wellness.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    
    private String token;
    private String message;
    private UserDto user;
    
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserDto {
        private Long id;
        private String name;
        private String email;
        private String role;
        private String phone;
        private String address;
        private String dob;
        private String gender;
        private String specialization; // Added for providers
    }
}

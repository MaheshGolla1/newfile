package com.healthcare.wellness.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    private String password;
    
    private String phone;
    
    private String address;
    
    private String dob;
    
    private String gender;
    
    // For providers only
    private String specialization;
    
    @NotNull(message = "Role is required")
    private String role; // PATIENT, DOCTOR, WELLNESS_PROVIDER, ADMIN
}

package com.doctorpat.controller;

import com.doctorpat.dto.AuthRequest;
import com.doctorpat.dto.AuthResponse;
import com.doctorpat.dto.UserRegistrationRequest;
import com.doctorpat.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Authentication management APIs")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    @Operation(
        summary = "User Login",
        description = "Authenticate user and return JWT token"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login successful",
            content = @Content(schema = @Schema(implementation = AuthResponse.class))),
        @ApiResponse(responseCode = "401", description = "Invalid credentials"),
        @ApiResponse(responseCode = "400", description = "Bad request")
    })
    public ResponseEntity<AuthResponse> login(
        @Parameter(description = "Login credentials", required = true)
        @Valid @RequestBody AuthRequest authRequest) {
        
        AuthResponse response = authService.login(authRequest);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/register")
    @Operation(
        summary = "User Registration",
        description = "Register a new user and return JWT token"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Registration successful",
            content = @Content(schema = @Schema(implementation = AuthResponse.class))),
        @ApiResponse(responseCode = "400", description = "Bad request or user already exists"),
        @ApiResponse(responseCode = "409", description = "User already exists")
    })
    public ResponseEntity<AuthResponse> register(
        @Parameter(description = "User registration details", required = true)
        @Valid @RequestBody UserRegistrationRequest registrationRequest) {
        
        AuthResponse response = authService.register(registrationRequest);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/validate")
    @Operation(
        summary = "Validate JWT Token",
        description = "Validate if the provided JWT token is valid"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Token is valid"),
        @ApiResponse(responseCode = "401", description = "Token is invalid")
    })
    public ResponseEntity<Boolean> validateToken(
        @Parameter(description = "JWT token to validate", required = true)
        @RequestHeader("Authorization") String token) {
        
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        
        boolean isValid = authService.validateToken(token);
        return ResponseEntity.ok(isValid);
    }
    
    @GetMapping("/profile")
    @Operation(
        summary = "Get User Profile",
        description = "Get current user profile information from JWT token"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Profile retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<String> getProfile(
        @Parameter(description = "JWT token", required = true)
        @RequestHeader("Authorization") String token) {
        
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        
        String username = authService.getUsernameFromToken(token);
        String role = authService.getRoleFromToken(token);
        
        return ResponseEntity.ok("Username: " + username + ", Role: " + role);
    }
}

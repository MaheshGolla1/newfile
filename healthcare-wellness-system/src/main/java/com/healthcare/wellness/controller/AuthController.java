package com.healthcare.wellness.controller;

import com.healthcare.wellness.dto.AuthRequest;
import com.healthcare.wellness.dto.AuthResponse;
import com.healthcare.wellness.dto.RegisterRequest;
import com.healthcare.wellness.dto.PatientRegistrationRequest;
import com.healthcare.wellness.entity.Gender;
import com.healthcare.wellness.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Authentication", description = "User registration and authentication endpoints")
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/register")
    @Operation(summary = "Register new user", description = "Register a new patient or healthcare provider")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User registered successfully",
            content = @Content(schema = @Schema(implementation = AuthResponse.class),
                examples = @ExampleObject(value = "{\"token\":\"eyJhbGciOiJIUzI1NiIs...\",\"message\":\"User registered successfully\",\"user\":{\"id\":1,\"name\":\"John Doe\",\"email\":\"john@example.com\",\"role\":\"PATIENT\"}}"))),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "409", description = "User already exists")
    })
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }
    
    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and return JWT token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login successful",
            content = @Content(schema = @Schema(implementation = AuthResponse.class),
                examples = @ExampleObject(value = "{\"token\":\"eyJhbGciOiJIUzI1NiIs...\",\"message\":\"Login successful\",\"user\":{\"id\":1,\"name\":\"John Doe\",\"email\":\"john@example.com\",\"role\":\"PATIENT\"}}"))),
        @ApiResponse(responseCode = "401", description = "Invalid credentials"),
        @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }
    
    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Check if the API is running")
    @ApiResponse(responseCode = "200", description = "API is running",
        content = @Content(examples = @ExampleObject(value = "Healthcare & Wellness Management System is running!")))
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Healthcare & Wellness Management System is running!");
    }
    
    @GetMapping("/test")
    @Operation(summary = "Test endpoint", description = "Simple test endpoint for CORS")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("CORS test successful!");
    }
}

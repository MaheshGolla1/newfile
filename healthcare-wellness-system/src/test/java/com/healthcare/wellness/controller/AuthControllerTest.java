package com.healthcare.wellness.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthcare.wellness.dto.AuthRequest;
import com.healthcare.wellness.dto.AuthResponse;
import com.healthcare.wellness.dto.RegisterRequest;
import com.healthcare.wellness.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    private AuthResponse mockAuthResponse;

    @BeforeEach
    void setUp() {
        mockAuthResponse = AuthResponse.builder()
                .token("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
                .message("Login successful")
                .user(AuthResponse.UserDto.builder()
                        .id(1L)
                        .name("John Doe")
                        .email("john@example.com")
                        .role("PATIENT")
                        .build())
                .build();
    }

    @Test
    void testLogin_Success() throws Exception {
        // Given
        AuthRequest authRequest = new AuthRequest("john@example.com", "password123");
        when(authService.authenticate(any(AuthRequest.class))).thenReturn(mockAuthResponse);

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."))
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.user.name").value("John Doe"))
                .andExpect(jsonPath("$.user.email").value("john@example.com"))
                .andExpect(jsonPath("$.user.role").value("PATIENT"));
    }

    @Test
    void testLogin_InvalidEmail() throws Exception {
        // Given
        AuthRequest authRequest = new AuthRequest("invalid-email", "password123");

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testRegister_Success() throws Exception {
        // Given
        RegisterRequest registerRequest = RegisterRequest.builder()
                .name("Jane Doe")
                .email("jane@example.com")
                .password("password123")
                .role("PATIENT")
                .build();
        when(authService.register(any(RegisterRequest.class))).thenReturn(mockAuthResponse);

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user.name").value("John Doe"));
    }

    @Test
    void testRegister_MissingRequiredFields() throws Exception {
        // Given
        RegisterRequest registerRequest = RegisterRequest.builder()
                .name("Jane Doe")
                .email("jane@example.com")
                // Missing password and role
                .build();

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testHealthCheck() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/auth/health"))
                .andExpect(status().isOk())
                .andExpect(content().string("Healthcare & Wellness Management System is running!"));
    }
}

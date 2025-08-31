package com.doctorpat.service;

import com.doctorpat.dto.AuthRequest;
import com.doctorpat.dto.AuthResponse;
import com.doctorpat.dto.UserRegistrationRequest;
import com.doctorpat.entity.User;
import com.doctorpat.repository.UserRepository;
import com.doctorpat.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private AuthRequest authRequest;
    private UserRegistrationRequest registrationRequest;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setName("John Doe");
        testUser.setEmail("john@example.com");
        testUser.setPassword("encodedPassword");
        testUser.setRole(User.UserRole.PATIENT);

        authRequest = new AuthRequest();
        authRequest.setEmail("john@example.com");
        authRequest.setPassword("password123");
        authRequest.setRole("PATIENT");

        registrationRequest = new UserRegistrationRequest();
        registrationRequest.setName("Jane Doe");
        registrationRequest.setEmail("jane@example.com");
        registrationRequest.setPassword("password123");
        registrationRequest.setRole("PATIENT");
        registrationRequest.setPhoneNumber("+1234567890");
    }

    @Test
    void testLogin_Success() {
        // Arrange
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(userRepository.findByEmail("john@example.com"))
                .thenReturn(Optional.of(testUser));
        when(jwtUtil.generateToken("john@example.com", "PATIENT"))
                .thenReturn("jwt-token");

        // Act
        AuthResponse response = authService.login(authRequest);

        // Assert
        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals("jwt-token", response.getRefreshToken());
        assertEquals(86400000L, response.getExpiresIn());
        assertNotNull(response.getUser());
        assertEquals("John Doe", response.getUser().getName());
        assertEquals("PATIENT", response.getUser().getRole());

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userRepository).findByEmail("john@example.com");
        verify(jwtUtil, times(2)).generateToken("john@example.com", "PATIENT");
    }

    @Test
    void testLogin_UserNotFound() {
        // Arrange
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(userRepository.findByEmail("john@example.com"))
                .thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> authService.login(authRequest));

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userRepository).findByEmail("john@example.com");
    }

    @Test
    void testLogin_InvalidRole() {
        // Arrange
        authRequest.setRole("INVALID_ROLE");
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(userRepository.findByEmail("john@example.com"))
                .thenReturn(Optional.of(testUser));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> authService.login(authRequest));

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userRepository).findByEmail("john@example.com");
    }

    @Test
    void testRegister_Success() {
        // Arrange
        when(userRepository.existsByEmail("jane@example.com"))
                .thenReturn(false);
        when(passwordEncoder.encode("password123"))
                .thenReturn("encodedPassword");
        when(userRepository.save(any(User.class)))
                .thenReturn(testUser);
        when(jwtUtil.generateToken("jane@example.com", "PATIENT"))
                .thenReturn("jwt-token");

        // Act
        AuthResponse response = authService.register(registrationRequest);

        // Assert
        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals("jwt-token", response.getRefreshToken());
        assertEquals(86400000L, response.getExpiresIn());
        assertNotNull(response.getUser());

        verify(userRepository).existsByEmail("jane@example.com");
        verify(passwordEncoder).encode("password123");
        verify(userRepository).save(any(User.class));
        verify(jwtUtil, times(2)).generateToken("jane@example.com", "PATIENT");
    }

    @Test
    void testRegister_UserAlreadyExists() {
        // Arrange
        when(userRepository.existsByEmail("jane@example.com"))
                .thenReturn(true);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> authService.register(registrationRequest));

        verify(userRepository).existsByEmail("jane@example.com");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testRegister_DoctorRole() {
        // Arrange
        registrationRequest.setRole("DOCTOR");
        registrationRequest.setSpecialization("Cardiology");
        registrationRequest.setLicenseNumber("LIC123");
        registrationRequest.setYearsOfExperience(10);
        registrationRequest.setConsultationFee(150.0);

        when(userRepository.existsByEmail("jane@example.com"))
                .thenReturn(false);
        when(passwordEncoder.encode("password123"))
                .thenReturn("encodedPassword");
        when(userRepository.save(any(User.class)))
                .thenReturn(testUser);
        when(jwtUtil.generateToken("jane@example.com", "DOCTOR"))
                .thenReturn("jwt-token");

        // Act
        AuthResponse response = authService.register(registrationRequest);

        // Assert
        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());

        verify(userRepository).existsByEmail("jane@example.com");
        verify(passwordEncoder).encode("password123");
        verify(userRepository).save(any(User.class));
        verify(jwtUtil, times(2)).generateToken("jane@example.com", "DOCTOR");
    }

    @Test
    void testValidateToken_Valid() {
        // Arrange
        String token = "valid-token";
        when(jwtUtil.validateToken(token))
                .thenReturn(true);

        // Act
        boolean isValid = authService.validateToken(token);

        // Assert
        assertTrue(isValid);
        verify(jwtUtil).validateToken(token);
    }

    @Test
    void testValidateToken_Invalid() {
        // Arrange
        String token = "invalid-token";
        when(jwtUtil.validateToken(token))
                .thenReturn(false);

        // Act
        boolean isValid = authService.validateToken(token);

        // Assert
        assertFalse(isValid);
        verify(jwtUtil).validateToken(token);
    }

    @Test
    void testGetUsernameFromToken() {
        // Arrange
        String token = "valid-token";
        when(jwtUtil.extractUsername(token))
                .thenReturn("john@example.com");

        // Act
        String username = authService.getUsernameFromToken(token);

        // Assert
        assertEquals("john@example.com", username);
        verify(jwtUtil).extractUsername(token);
    }

    @Test
    void testGetRoleFromToken() {
        // Arrange
        String token = "valid-token";
        when(jwtUtil.extractRole(token))
                .thenReturn("PATIENT");

        // Act
        String role = authService.getRoleFromToken(token);

        // Assert
        assertEquals("PATIENT", role);
        verify(jwtUtil).extractRole(token);
    }
}

package com.doctorpat.service;

import com.doctorpat.dto.AuthRequest;
import com.doctorpat.dto.AuthResponse;
import com.doctorpat.dto.UserRegistrationRequest;
import com.doctorpat.entity.User;
import com.doctorpat.repository.UserRepository;
import com.doctorpat.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public AuthResponse login(AuthRequest authRequest) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
        );
        
        // Get user details
        User user = userRepository.findByEmail(authRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Verify role
        if (!user.getRole().name().equalsIgnoreCase(authRequest.getRole())) {
            throw new RuntimeException("Invalid role for this user");
        }
        
        // Generate JWT token
        String token = jwtUtil.generateToken(authRequest.getEmail(), user.getRole().name());
        String refreshToken = jwtUtil.generateToken(authRequest.getEmail(), user.getRole().name());
        
        return new AuthResponse(token, refreshToken, 86400000L, user);
    }
    
    public AuthResponse register(UserRegistrationRequest registrationRequest) {
        // Check if user already exists
        if (userRepository.existsByEmail(registrationRequest.getEmail())) {
            throw new RuntimeException("User with this email already exists");
        }
        
        // Create new user
        User user = new User();
        user.setName(registrationRequest.getName());
        user.setEmail(registrationRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
        user.setRole(User.UserRole.valueOf(registrationRequest.getRole().toUpperCase()));
        user.setPhoneNumber(registrationRequest.getPhoneNumber());
        user.setProfileImage(registrationRequest.getProfileImage());
        
        // Set role-specific fields
        if (registrationRequest.getRole().equalsIgnoreCase("PATIENT")) {
            user.setDateOfBirth(registrationRequest.getDateOfBirth());
            user.setGender(User.Gender.valueOf(registrationRequest.getGender().toUpperCase()));
            user.setAddress(registrationRequest.getAddress());
        } else if (registrationRequest.getRole().equalsIgnoreCase("DOCTOR")) {
            user.setSpecialization(registrationRequest.getSpecialization());
            user.setLicenseNumber(registrationRequest.getLicenseNumber());
            user.setYearsOfExperience(registrationRequest.getYearsOfExperience());
            user.setConsultationFee(registrationRequest.getConsultationFee());
        }
        
        // Save user
        user = userRepository.save(user);
        
        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        String refreshToken = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        
        return new AuthResponse(token, refreshToken, 86400000L, user);
    }
    
    public boolean validateToken(String token) {
        return jwtUtil.validateToken(token);
    }
    
    public String getUsernameFromToken(String token) {
        return jwtUtil.extractUsername(token);
    }
    
    public String getRoleFromToken(String token) {
        return jwtUtil.extractRole(token);
    }
}

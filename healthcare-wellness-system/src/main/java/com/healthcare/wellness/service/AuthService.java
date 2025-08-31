package com.healthcare.wellness.service;

import com.healthcare.wellness.dto.AuthRequest;
import com.healthcare.wellness.dto.AuthResponse;
import com.healthcare.wellness.dto.PatientRegistrationRequest;
import com.healthcare.wellness.dto.RegisterRequest;
import com.healthcare.wellness.entity.Patient;
import com.healthcare.wellness.entity.Provider;
import com.healthcare.wellness.entity.ProviderRole;
import com.healthcare.wellness.entity.User;
import com.healthcare.wellness.repository.PatientRepository;
import com.healthcare.wellness.repository.ProviderRepository;
import com.healthcare.wellness.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final ProviderRepository providerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        
        String role = request.getRole().toUpperCase();
        
        switch (role) {
            case "PATIENT":
                return registerPatient(request);
            case "DOCTOR":
            case "WELLNESS_PROVIDER":
            case "ADMIN":
                return registerProvider(request);
            default:
                throw new RuntimeException("Invalid role: " + role);
        }
    }
    
    private AuthResponse registerPatient(RegisterRequest request) {
        Patient patient = new Patient();
        patient.setName(request.getName());
        patient.setEmail(request.getEmail());
        patient.setPassword(passwordEncoder.encode(request.getPassword()));
        patient.setPhone(request.getPhone());
        patient.setAddress(request.getAddress());
        patient.setDob(request.getDob() != null ? LocalDate.parse(request.getDob()) : null);
        patient.setGender(request.getGender() != null ? com.healthcare.wellness.entity.Gender.valueOf(request.getGender().toUpperCase()) : null);
        
        Patient savedPatient = patientRepository.save(patient);
        
        String jwtToken = jwtService.generateToken(savedPatient);
        
        AuthResponse.UserDto userDto = AuthResponse.UserDto.builder()
                .id(savedPatient.getId())
                .name(savedPatient.getName())
                .email(savedPatient.getEmail())
                .role("PATIENT")
                .phone(savedPatient.getPhone())
                .address(savedPatient.getAddress())
                .dob(savedPatient.getDob() != null ? savedPatient.getDob().toString() : null)
                .gender(savedPatient.getGender() != null ? savedPatient.getGender().toString() : null)
                .build();
        
        return AuthResponse.builder()
                .token(jwtToken)
                .message("Patient registration successful")
                .user(userDto)
                .build();
    }
    
    private AuthResponse registerProvider(RegisterRequest request) {
        Provider provider = new Provider();
        provider.setName(request.getName());
        provider.setEmail(request.getEmail());
        provider.setPassword(passwordEncoder.encode(request.getPassword()));
        provider.setPhone(request.getPhone());
        provider.setSpecialization(request.getSpecialization());
        provider.setRole(ProviderRole.valueOf(request.getRole().toUpperCase()));
        
        Provider savedProvider = providerRepository.save(provider);
        
        String jwtToken = jwtService.generateToken(savedProvider);
        
        AuthResponse.UserDto userDto = AuthResponse.UserDto.builder()
                .id(savedProvider.getId())
                .name(savedProvider.getName())
                .email(savedProvider.getEmail())
                .role(savedProvider.getRole().toString())
                .phone(savedProvider.getPhone())
                .specialization(savedProvider.getSpecialization())
                .build();
        
        return AuthResponse.builder()
                .token(jwtToken)
                .message("Provider registration successful")
                .user(userDto)
                .build();
    }
    
    public AuthResponse register(PatientRegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        
        Patient patient = new Patient();
        patient.setName(request.getName());
        patient.setEmail(request.getEmail());
        patient.setPassword(passwordEncoder.encode(request.getPassword()));
        patient.setPhone(request.getPhone());
        patient.setAddress(request.getAddress());
        patient.setDob(request.getDateOfBirth());
        patient.setGender(request.getGender());
        
        Patient savedPatient = patientRepository.save(patient);
        
        String jwtToken = jwtService.generateToken(savedPatient);
        
        AuthResponse.UserDto userDto = AuthResponse.UserDto.builder()
                .id(savedPatient.getId())
                .name(savedPatient.getName())
                .email(savedPatient.getEmail())
                .role("PATIENT")
                .phone(savedPatient.getPhone())
                .address(savedPatient.getAddress())
                .dob(savedPatient.getDob() != null ? savedPatient.getDob().toString() : null)
                .gender(savedPatient.getGender() != null ? savedPatient.getGender().toString() : null)
                .build();
        
        return AuthResponse.builder()
                .token(jwtToken)
                .message("Registration successful")
                .user(userDto)
                .build();
    }
    
    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String jwtToken = jwtService.generateToken(user);
        
        AuthResponse.UserDto userDto = AuthResponse.UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().toString())
                .phone(user.getPhone())
                .build();
        
        return AuthResponse.builder()
                .token(jwtToken)
                .message("Authentication successful")
                .user(userDto)
                .build();
    }
}

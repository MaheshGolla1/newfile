package com.healthcare.wellness.service;

import com.healthcare.wellness.dto.AuthRequest;
import com.healthcare.wellness.dto.AuthResponse;
import com.healthcare.wellness.dto.PatientRegistrationRequest;
import com.healthcare.wellness.dto.RegisterRequest;
import com.healthcare.wellness.entity.Patient;
import com.healthcare.wellness.entity.Provider;
import com.healthcare.wellness.entity.ProviderRole;
import com.healthcare.wellness.repository.PatientRepository;
import com.healthcare.wellness.repository.ProviderRepository;
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
    
    private final PatientRepository patientRepository;
    private final ProviderRepository providerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    
    public AuthResponse register(RegisterRequest request) {
        // Check if email exists in either patients or providers
        if (patientRepository.existsByEmail(request.getEmail()) || 
            providerRepository.existsByEmail(request.getEmail())) {
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
        Patient patient = Patient.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .address(request.getAddress())
                .dob(request.getDob() != null ? LocalDate.parse(request.getDob()) : null)
                .gender(request.getGender() != null ? com.healthcare.wellness.entity.Gender.valueOf(request.getGender().toUpperCase()) : null)
                .build();
        
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
        Provider provider = Provider.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .specialization(request.getSpecialization())
                .role(ProviderRole.valueOf(request.getRole().toUpperCase()))
                .build();
        
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
        if (patientRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        
        Patient patient = Patient.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .address(request.getAddress())
                .dob(request.getDateOfBirth())
                .gender(request.getGender())
                .build();
        
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
        
        // Try to find user in patients first, then providers
        UserDetails user = patientRepository.findByEmail(request.getEmail())
                .orElseGet(() -> providerRepository.findByEmail(request.getEmail())
                        .orElseThrow(() -> new RuntimeException("User not found")));
        
        String jwtToken = jwtService.generateToken(user);
        
        AuthResponse.UserDto userDto = AuthResponse.UserDto.builder()
                .id(getUserId(user))
                .name(getUserName(user))
                .email(user.getUsername())
                .role(getUserRole(user))
                .phone(getUserPhone(user))
                .build();
        
        return AuthResponse.builder()
                .token(jwtToken)
                .message("Authentication successful")
                .user(userDto)
                .build();
    }
    
    private Long getUserId(UserDetails user) {
        if (user instanceof Patient) {
            return ((Patient) user).getId();
        } else if (user instanceof Provider) {
            return ((Provider) user).getId();
        }
        return null;
    }
    
    private String getUserName(UserDetails user) {
        if (user instanceof Patient) {
            return ((Patient) user).getName();
        } else if (user instanceof Provider) {
            return ((Provider) user).getName();
        }
        return null;
    }
    
    private String getUserRole(UserDetails user) {
        if (user instanceof Patient) {
            return "PATIENT";
        } else if (user instanceof Provider) {
            return ((Provider) user).getRole().toString();
        }
        return null;
    }
    
    private String getUserPhone(UserDetails user) {
        if (user instanceof Patient) {
            return ((Patient) user).getPhone();
        } else if (user instanceof Provider) {
            return ((Provider) user).getPhone();
        }
        return null;
    }
}

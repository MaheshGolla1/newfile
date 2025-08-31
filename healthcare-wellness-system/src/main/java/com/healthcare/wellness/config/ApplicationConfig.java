package com.healthcare.wellness.config;

import com.healthcare.wellness.repository.PatientRepository;
import com.healthcare.wellness.repository.ProviderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {
    
    private final PatientRepository patientRepository;
    private final ProviderRepository providerRepository;
    
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            // First try to find in patients
            UserDetails patient = patientRepository.findByEmail(username).orElse(null);
            if (patient != null) {
                return patient;
            }
            
            // Then try to find in providers
            UserDetails provider = providerRepository.findByEmail(username).orElse(null);
            if (provider != null) {
                return provider;
            }
            
            throw new UsernameNotFoundException("User not found with email: " + username);
        };
    }
    
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

package com.healthcare.wellness.service;

import com.healthcare.wellness.entity.Provider;
import com.healthcare.wellness.repository.ProviderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProviderService {
    
    private final ProviderRepository providerRepository;
    
    public Provider getProviderById(Long id) {
        return providerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
    }
    
    public Provider updateProvider(Long id, Provider providerDetails) {
        return providerRepository.findById(id)
                .map(provider -> {
                    provider.setName(providerDetails.getName());
                    provider.setEmail(providerDetails.getEmail());
                    provider.setSpecialization(providerDetails.getSpecialization());
                    provider.setPhone(providerDetails.getPhone());
                    provider.setRole(providerDetails.getRole());
                    return providerRepository.save(provider);
                })
                .orElseThrow(() -> new RuntimeException("Provider not found"));
    }
    
    public Provider getCurrentProvider() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return providerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Current provider not found"));
    }
    
    public Provider updateCurrentProvider(Provider providerDetails) {
        Provider currentProvider = getCurrentProvider();
        
        currentProvider.setName(providerDetails.getName());
        currentProvider.setEmail(providerDetails.getEmail());
        currentProvider.setSpecialization(providerDetails.getSpecialization());
        currentProvider.setPhone(providerDetails.getPhone());
        currentProvider.setRole(providerDetails.getRole());
        
        return providerRepository.save(currentProvider);
    }
}

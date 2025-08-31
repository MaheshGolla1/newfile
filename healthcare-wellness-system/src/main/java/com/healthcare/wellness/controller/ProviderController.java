package com.healthcare.wellness.controller;

import com.healthcare.wellness.entity.Provider;
import com.healthcare.wellness.service.ProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/providers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProviderController {
    
    private final ProviderService providerService;
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('PROVIDER', 'ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<Provider> getProviderById(@PathVariable Long id) {
        return ResponseEntity.ok(providerService.getProviderById(id));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('PROVIDER', 'ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<Provider> updateProvider(@PathVariable Long id, @Valid @RequestBody Provider provider) {
        return ResponseEntity.ok(providerService.updateProvider(id, provider));
    }
    
    @GetMapping("/profile")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<Provider> getCurrentProviderProfile() {
        return ResponseEntity.ok(providerService.getCurrentProvider());
    }
    
    @PutMapping("/profile")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<Provider> updateCurrentProviderProfile(@Valid @RequestBody Provider provider) {
        return ResponseEntity.ok(providerService.updateCurrentProvider(provider));
    }
}

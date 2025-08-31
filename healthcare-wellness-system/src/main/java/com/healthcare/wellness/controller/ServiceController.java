package com.healthcare.wellness.controller;

import com.healthcare.wellness.entity.WellnessService;
import com.healthcare.wellness.service.WellnessServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ServiceController {

    @Autowired
    private WellnessServiceService wellnessServiceService;

    @GetMapping
    public ResponseEntity<List<WellnessService>> getAllServices() {
        return ResponseEntity.ok(wellnessServiceService.getAllServices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WellnessService> getServiceById(@PathVariable Long id) {
        return wellnessServiceService.getServiceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<WellnessService>> getServicesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(wellnessServiceService.getServicesByCategory(category));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<WellnessService>> getServicesByProvider(@PathVariable Long providerId) {
        return ResponseEntity.ok(wellnessServiceService.getServicesByProvider(providerId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('PROVIDER', 'ADMIN')")
    public ResponseEntity<WellnessService> createService(@RequestBody WellnessService service) {
        return ResponseEntity.ok(wellnessServiceService.createService(service));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('PROVIDER', 'ADMIN')")
    public ResponseEntity<WellnessService> updateService(@PathVariable Long id, @RequestBody WellnessService service) {
        return ResponseEntity.ok(wellnessServiceService.updateService(id, service));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('PROVIDER', 'ADMIN')")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        wellnessServiceService.deleteService(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<WellnessService>> searchServices(@RequestParam String query) {
        return ResponseEntity.ok(wellnessServiceService.searchServices(query));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        return ResponseEntity.ok(wellnessServiceService.getAllCategories());
    }
}

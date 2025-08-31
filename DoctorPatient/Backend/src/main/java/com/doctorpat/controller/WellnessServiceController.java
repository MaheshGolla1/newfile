package com.doctorpat.controller;

import com.doctorpat.entity.WellnessService;
import com.doctorpat.repository.WellnessServiceRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/wellness-services")
@Tag(name = "Wellness Services", description = "Wellness services and programs management APIs")
@CrossOrigin(origins = "*")
public class WellnessServiceController {
    
    @Autowired
    private WellnessServiceRepository wellnessServiceRepository;
    
    @GetMapping
    @Operation(
        summary = "Get All Wellness Services",
        description = "Retrieve all active wellness services from the system"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Wellness services retrieved successfully")
    })
    public ResponseEntity<List<WellnessService>> getAllWellnessServices() {
        List<WellnessService> services = wellnessServiceRepository.findByIsActiveTrue();
        return ResponseEntity.ok(services);
    }
    
    @GetMapping("/{id}")
    @Operation(
        summary = "Get Wellness Service by ID",
        description = "Retrieve a specific wellness service by its ID"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Wellness service found"),
        @ApiResponse(responseCode = "404", description = "Wellness service not found")
    })
    public ResponseEntity<WellnessService> getWellnessServiceById(
        @Parameter(description = "Wellness service ID", required = true)
        @PathVariable Long id) {
        
        Optional<WellnessService> service = wellnessServiceRepository.findById(id);
        return service.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/category/{category}")
    @Operation(
        summary = "Get Wellness Services by Category",
        description = "Retrieve all wellness services in a specific category"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Wellness services retrieved successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid category")
    })
    public ResponseEntity<List<WellnessService>> getWellnessServicesByCategory(
        @Parameter(description = "Service category", required = true)
        @PathVariable String category) {
        
        try {
            WellnessService.ServiceCategory serviceCategory = WellnessService.ServiceCategory.valueOf(category.toUpperCase());
            List<WellnessService> services = wellnessServiceRepository.findByCategoryAndIsActiveTrue(serviceCategory);
            return ResponseEntity.ok(services);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/search")
    @Operation(
        summary = "Search Wellness Services",
        description = "Search wellness services by keyword"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Search results retrieved successfully")
    })
    public ResponseEntity<List<WellnessService>> searchWellnessServices(
        @Parameter(description = "Search keyword", required = true)
        @RequestParam String keyword) {
        
        List<WellnessService> services = wellnessServiceRepository.searchByKeyword(keyword);
        return ResponseEntity.ok(services);
    }
    
    @GetMapping("/price-range")
    @Operation(
        summary = "Get Wellness Services by Price Range",
        description = "Retrieve wellness services within a specific price range"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Wellness services retrieved successfully")
    })
    public ResponseEntity<List<WellnessService>> getWellnessServicesByPriceRange(
        @Parameter(description = "Minimum price")
        @RequestParam(required = false) BigDecimal minPrice,
        @Parameter(description = "Maximum price")
        @RequestParam(required = false) BigDecimal maxPrice) {
        
        if (minPrice != null && maxPrice != null) {
            List<WellnessService> services = wellnessServiceRepository.findByPriceRange(minPrice, maxPrice);
            return ResponseEntity.ok(services);
        } else if (maxPrice != null) {
            List<WellnessService> services = wellnessServiceRepository.findByMaxPrice(maxPrice);
            return ResponseEntity.ok(services);
        } else {
            List<WellnessService> services = wellnessServiceRepository.findByIsActiveTrue();
            return ResponseEntity.ok(services);
        }
    }
    
    @GetMapping("/available")
    @Operation(
        summary = "Get Available Wellness Services",
        description = "Retrieve wellness services that have available slots"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Available services retrieved successfully")
    })
    public ResponseEntity<List<WellnessService>> getAvailableWellnessServices() {
        List<WellnessService> services = wellnessServiceRepository.findAvailableServices();
        return ResponseEntity.ok(services);
    }
    
    @PostMapping
    @Operation(
        summary = "Create Wellness Service",
        description = "Create a new wellness service"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Wellness service created successfully"),
        @ApiResponse(responseCode = "400", description = "Bad request"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<WellnessService> createWellnessService(
        @Parameter(description = "Wellness service details", required = true)
        @Valid @RequestBody WellnessService wellnessService) {
        
        WellnessService savedService = wellnessServiceRepository.save(wellnessService);
        return ResponseEntity.ok(savedService);
    }
    
    @PutMapping("/{id}")
    @Operation(
        summary = "Update Wellness Service",
        description = "Update an existing wellness service"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Wellness service updated successfully"),
        @ApiResponse(responseCode = "404", description = "Wellness service not found"),
        @ApiResponse(responseCode = "400", description = "Bad request"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<WellnessService> updateWellnessService(
        @Parameter(description = "Wellness service ID", required = true)
        @PathVariable Long id,
        @Parameter(description = "Updated wellness service details", required = true)
        @Valid @RequestBody WellnessService wellnessServiceDetails) {
        
        Optional<WellnessService> serviceOptional = wellnessServiceRepository.findById(id);
        if (serviceOptional.isPresent()) {
            WellnessService service = serviceOptional.get();
            
            service.setName(wellnessServiceDetails.getName());
            service.setDescription(wellnessServiceDetails.getDescription());
            service.setCategory(wellnessServiceDetails.getCategory());
            service.setDurationMinutes(wellnessServiceDetails.getDurationMinutes());
            service.setPrice(wellnessServiceDetails.getPrice());
            service.setMaxParticipants(wellnessServiceDetails.getMaxParticipants());
            service.setServiceImage(wellnessServiceDetails.getServiceImage());
            service.setRequirements(wellnessServiceDetails.getRequirements());
            service.setBenefits(wellnessServiceDetails.getBenefits());
            service.setIsActive(wellnessServiceDetails.getIsActive());
            
            WellnessService updatedService = wellnessServiceRepository.save(service);
            return ResponseEntity.ok(updatedService);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    @Operation(
        summary = "Delete Wellness Service",
        description = "Delete a wellness service (soft delete)"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Wellness service deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Wellness service not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteWellnessService(
        @Parameter(description = "Wellness service ID", required = true)
        @PathVariable Long id) {
        
        Optional<WellnessService> serviceOptional = wellnessServiceRepository.findById(id);
        if (serviceOptional.isPresent()) {
            WellnessService service = serviceOptional.get();
            service.setIsActive(false);
            wellnessServiceRepository.save(service);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}/participants")
    @Operation(
        summary = "Update Participant Count",
        description = "Update the current participant count for a wellness service"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Participant count updated successfully"),
        @ApiResponse(responseCode = "404", description = "Wellness service not found"),
        @ApiResponse(responseCode = "400", description = "Invalid participant count"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<WellnessService> updateParticipantCount(
        @Parameter(description = "Wellness service ID", required = true)
        @PathVariable Long id,
        @Parameter(description = "New participant count", required = true)
        @RequestParam Integer currentParticipants) {
        
        Optional<WellnessService> serviceOptional = wellnessServiceRepository.findById(id);
        if (serviceOptional.isPresent()) {
            WellnessService service = serviceOptional.get();
            
            if (currentParticipants < 0 || (service.getMaxParticipants() != null && currentParticipants > service.getMaxParticipants())) {
                return ResponseEntity.badRequest().build();
            }
            
            service.setCurrentParticipants(currentParticipants);
            WellnessService updatedService = wellnessServiceRepository.save(service);
            return ResponseEntity.ok(updatedService);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/stats")
    @Operation(
        summary = "Get Wellness Service Statistics",
        description = "Get statistics about wellness services in the system"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Statistics retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> getWellnessServiceStats() {
        Long totalServices = wellnessServiceRepository.countActiveServices();
        Long fitnessServices = wellnessServiceRepository.countByCategory(WellnessService.ServiceCategory.FITNESS);
        Long nutritionServices = wellnessServiceRepository.countByCategory(WellnessService.ServiceCategory.NUTRITION);
        Long mentalHealthServices = wellnessServiceRepository.countByCategory(WellnessService.ServiceCategory.MENTAL_HEALTH);
        
        return ResponseEntity.ok(Map.of(
            "totalServices", totalServices,
            "fitnessServices", fitnessServices,
            "nutritionServices", nutritionServices,
            "mentalHealthServices", mentalHealthServices
        ));
    }
}

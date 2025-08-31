package com.healthcare.wellness.repository;

import com.healthcare.wellness.entity.ServiceCategory;
import com.healthcare.wellness.entity.WellnessService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WellnessServiceRepository extends JpaRepository<WellnessService, Long> {
    
    List<WellnessService> findByCategory(ServiceCategory category);
    
    List<WellnessService> findByIsActiveTrue();
    
    List<WellnessService> findByCategoryAndIsActiveTrue(ServiceCategory category);
    
    // Additional methods for service layer
    List<WellnessService> findByCategory(String category);
    
    List<WellnessService> findByProviderId(Long providerId);
    
    List<WellnessService> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);
}

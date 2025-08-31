package com.doctorpat.repository;

import com.doctorpat.entity.WellnessService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface WellnessServiceRepository extends JpaRepository<WellnessService, Long> {
    
    List<WellnessService> findByIsActiveTrue();
    
    List<WellnessService> findByCategory(WellnessService.ServiceCategory category);
    
    List<WellnessService> findByCategoryAndIsActiveTrue(WellnessService.ServiceCategory category);
    
    @Query("SELECT ws FROM WellnessService ws WHERE ws.price <= :maxPrice AND ws.isActive = true")
    List<WellnessService> findByMaxPrice(@Param("maxPrice") BigDecimal maxPrice);
    
    @Query("SELECT ws FROM WellnessService ws WHERE ws.price >= :minPrice AND ws.price <= :maxPrice AND ws.isActive = true")
    List<WellnessService> findByPriceRange(@Param("minPrice") BigDecimal minPrice, 
                                          @Param("maxPrice") BigDecimal maxPrice);
    
    @Query("SELECT ws FROM WellnessService ws WHERE ws.durationMinutes <= :maxDuration AND ws.isActive = true")
    List<WellnessService> findByMaxDuration(@Param("maxDuration") Integer maxDuration);
    
    @Query("SELECT ws FROM WellnessService ws WHERE ws.currentParticipants < ws.maxParticipants AND ws.isActive = true")
    List<WellnessService> findAvailableServices();
    
    @Query("SELECT ws FROM WellnessService ws WHERE ws.name LIKE %:keyword% OR ws.description LIKE %:keyword% AND ws.isActive = true")
    List<WellnessService> searchByKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT COUNT(ws) FROM WellnessService ws WHERE ws.category = :category")
    Long countByCategory(@Param("category") WellnessService.ServiceCategory category);
    
    @Query("SELECT COUNT(ws) FROM WellnessService ws WHERE ws.isActive = true")
    Long countActiveServices();
}

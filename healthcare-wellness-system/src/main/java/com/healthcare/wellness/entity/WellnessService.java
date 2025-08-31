package com.healthcare.wellness.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "wellness_services")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WellnessService {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Service name is required")
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "duration")
    private Integer duration; // Duration in days/weeks
    
    @Positive(message = "Fee must be positive")
    @Column(name = "fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal fee;
    
    @Column(name = "category")
    private String category;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Constructors
    public WellnessService() {}
    
    public WellnessService(String name, String description, Integer duration, BigDecimal fee, String category) {
        this.name = name;
        this.description = description;
        this.duration = duration;
        this.fee = fee;
        this.category = category;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Integer getDuration() {
        return duration;
    }
    
    public void setDuration(Integer duration) {
        this.duration = duration;
    }
    
    public BigDecimal getFee() {
        return fee;
    }
    
    public void setFee(BigDecimal fee) {
        this.fee = fee;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    // Additional methods for compatibility
    public Integer getDurationMinutes() {
        return duration;
    }
    
    public void setDurationMinutes(Integer durationMinutes) {
        this.duration = durationMinutes;
    }
    
    public Double getPrice() {
        return fee != null ? fee.doubleValue() : null;
    }
    
    public void setPrice(Double price) {
        this.fee = price != null ? BigDecimal.valueOf(price) : null;
    }
    
    public String getProvider() {
        return "Wellness Center"; // Default provider name
    }
}

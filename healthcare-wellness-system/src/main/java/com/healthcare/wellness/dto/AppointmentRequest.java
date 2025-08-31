package com.healthcare.wellness.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentRequest {
    
    @NotNull(message = "Provider ID is required")
    private Long providerId;
    
    @NotNull(message = "Appointment date is required")
    private LocalDateTime appointmentDate;
    
    private String notes;
}

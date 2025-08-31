package com.healthcare.wellness.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequest {
    
    @NotNull(message = "Appointment ID is required")
    private Long appointmentId;
    
    @NotNull(message = "Service ID is required")
    private Long serviceId;
    
    private String transactionId;
}

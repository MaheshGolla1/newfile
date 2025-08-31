package com.doctorpat.controller;

import com.doctorpat.entity.Payment;
import com.doctorpat.entity.Appointment;
import com.doctorpat.entity.User;
import com.doctorpat.repository.PaymentRepository;
import com.doctorpat.repository.AppointmentRepository;
import com.doctorpat.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.Map;

@RestController
@RequestMapping("/payments")
@Tag(name = "Payment Management", description = "Payment processing and management APIs")
@CrossOrigin(origins = "*")
public class PaymentController {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping
    @Operation(
        summary = "Get All Payments",
        description = "Retrieve all payments from the system"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Payments retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Payment>> getAllPayments() {
        List<Payment> payments = paymentRepository.findAll();
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/{id}")
    @Operation(
        summary = "Get Payment by ID",
        description = "Retrieve a specific payment by its ID"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Payment found"),
        @ApiResponse(responseCode = "404", description = "Payment not found")
    })
    public ResponseEntity<Payment> getPaymentById(
        @Parameter(description = "Payment ID", required = true)
        @PathVariable Long id) {
        
        Optional<Payment> payment = paymentRepository.findById(id);
        return payment.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/patient/{patientId}")
    @Operation(
        summary = "Get Payments by Patient",
        description = "Retrieve all payments for a specific patient"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Payments retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Patient not found")
    })
    public ResponseEntity<List<Payment>> getPaymentsByPatient(
        @Parameter(description = "Patient ID", required = true)
        @PathVariable Long patientId) {
        
        Optional<User> patient = userRepository.findById(patientId);
        if (patient.isPresent()) {
            List<Payment> payments = paymentRepository.findByPatient(patient.get());
            return ResponseEntity.ok(payments);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/doctor/{doctorId}")
    @Operation(
        summary = "Get Payments by Doctor",
        description = "Retrieve all payments for a specific doctor"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Payments retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Doctor not found")
    })
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<List<Payment>> getPaymentsByDoctor(
        @Parameter(description = "Doctor ID", required = true)
        @PathVariable Long doctorId) {
        
        Optional<User> doctor = userRepository.findById(doctorId);
        if (doctor.isPresent()) {
            List<Payment> payments = paymentRepository.findByDoctor(doctor.get());
            return ResponseEntity.ok(payments);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/status/{status}")
    @Operation(
        summary = "Get Payments by Status",
        description = "Retrieve all payments with a specific status"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Payments retrieved successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid status")
    })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Payment>> getPaymentsByStatus(
        @Parameter(description = "Payment status", required = true)
        @PathVariable String status) {
        
        try {
            Payment.PaymentStatus paymentStatus = Payment.PaymentStatus.valueOf(status.toUpperCase());
            List<Payment> payments = paymentRepository.findByStatus(paymentStatus);
            return ResponseEntity.ok(payments);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/process")
    @Operation(
        summary = "Process Payment",
        description = "Process a payment for an appointment"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Payment processed successfully"),
        @ApiResponse(responseCode = "400", description = "Bad request"),
        @ApiResponse(responseCode = "404", description = "Appointment not found")
    })
    public ResponseEntity<Payment> processPayment(
        @Parameter(description = "Payment details", required = true)
        @RequestBody PaymentRequest paymentRequest) {
        
        // Find the appointment
        Optional<Appointment> appointmentOptional = appointmentRepository.findById(paymentRequest.getAppointmentId());
        if (appointmentOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Appointment appointment = appointmentOptional.get();
        
        // Create payment
        Payment payment = new Payment();
        payment.setAppointment(appointment);
        payment.setPatient(appointment.getPatient());
        payment.setDoctor(appointment.getDoctor());
        payment.setAmount(paymentRequest.getAmount());
        payment.setPaymentMethod(paymentRequest.getPaymentMethod());
        payment.setTransactionId(UUID.randomUUID().toString());
        payment.setCardLastFour(paymentRequest.getCardLastFour());
        payment.setCardType(paymentRequest.getCardType());
        payment.setBillingAddress(paymentRequest.getBillingAddress());
        
        // Simulate payment processing
        try {
            // In a real application, this would integrate with a payment gateway
            Thread.sleep(1000); // Simulate processing time
            
            // Simulate successful payment (90% success rate)
            if (Math.random() > 0.1) {
                payment.setStatus(Payment.PaymentStatus.COMPLETED);
                payment.setProcessedAt(LocalDateTime.now());
                
                // Update appointment payment status
                appointment.setPaymentStatus(Appointment.PaymentStatus.PAID);
                appointmentRepository.save(appointment);
                
                Payment savedPayment = paymentRepository.save(payment);
                return ResponseEntity.ok(savedPayment);
            } else {
                payment.setStatus(Payment.PaymentStatus.FAILED);
                payment.setFailureReason("Payment gateway error");
                payment.setProcessedAt(LocalDateTime.now());
                
                Payment savedPayment = paymentRepository.save(payment);
                return ResponseEntity.badRequest().body(savedPayment);
            }
        } catch (InterruptedException e) {
            payment.setStatus(Payment.PaymentStatus.FAILED);
            payment.setFailureReason("Processing timeout");
            payment.setProcessedAt(LocalDateTime.now());
            
            Payment savedPayment = paymentRepository.save(payment);
            return ResponseEntity.badRequest().body(savedPayment);
        }
    }
    
    @PostMapping("/{id}/refund")
    @Operation(
        summary = "Process Refund",
        description = "Process a refund for a payment"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Refund processed successfully"),
        @ApiResponse(responseCode = "404", description = "Payment not found"),
        @ApiResponse(responseCode = "400", description = "Payment cannot be refunded")
    })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Payment> processRefund(
        @Parameter(description = "Payment ID", required = true)
        @PathVariable Long id,
        @Parameter(description = "Refund amount")
        @RequestParam(required = false) BigDecimal refundAmount,
        @Parameter(description = "Refund reason")
        @RequestParam(required = false) String refundReason) {
        
        Optional<Payment> paymentOptional = paymentRepository.findById(id);
        if (paymentOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Payment payment = paymentOptional.get();
        
        if (payment.getStatus() != Payment.PaymentStatus.COMPLETED) {
            return ResponseEntity.badRequest().build();
        }
        
        // Set refund amount to full amount if not specified
        if (refundAmount == null) {
            refundAmount = payment.getAmount();
        }
        
        payment.setRefundAmount(refundAmount);
        payment.setRefundReason(refundReason);
        payment.setStatus(Payment.PaymentStatus.REFUNDED);
        
        Payment updatedPayment = paymentRepository.save(payment);
        return ResponseEntity.ok(updatedPayment);
    }
    
    @GetMapping("/revenue")
    @Operation(
        summary = "Get Revenue Statistics",
        description = "Get revenue statistics for a date range"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Revenue statistics retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> getRevenueStats(
        @Parameter(description = "Start date (yyyy-MM-dd)")
        @RequestParam(required = false) String startDate,
        @Parameter(description = "End date (yyyy-MM-dd)")
        @RequestParam(required = false) String endDate) {
        
        LocalDateTime start = startDate != null ? LocalDateTime.parse(startDate + "T00:00:00") : LocalDateTime.now().minusDays(30);
        LocalDateTime end = endDate != null ? LocalDateTime.parse(endDate + "T23:59:59") : LocalDateTime.now();
        
        BigDecimal totalRevenue = paymentRepository.getTotalRevenue(start, end);
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }
        
        Long completedPayments = paymentRepository.countByStatus(Payment.PaymentStatus.COMPLETED);
        Long failedPayments = paymentRepository.countByStatus(Payment.PaymentStatus.FAILED);
        
        return ResponseEntity.ok(Map.of(
            "totalRevenue", totalRevenue,
            "completedPayments", completedPayments,
            "failedPayments", failedPayments,
            "startDate", start,
            "endDate", end
        ));
    }
    
    // Inner class for payment request
    public static class PaymentRequest {
        private Long appointmentId;
        private BigDecimal amount;
        private Payment.PaymentMethod paymentMethod;
        private String cardLastFour;
        private String cardType;
        private String billingAddress;
        
        // Getters and Setters
        public Long getAppointmentId() { return appointmentId; }
        public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }
        
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        
        public Payment.PaymentMethod getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(Payment.PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
        
        public String getCardLastFour() { return cardLastFour; }
        public void setCardLastFour(String cardLastFour) { this.cardLastFour = cardLastFour; }
        
        public String getCardType() { return cardType; }
        public void setCardType(String cardType) { this.cardType = cardType; }
        
        public String getBillingAddress() { return billingAddress; }
        public void setBillingAddress(String billingAddress) { this.billingAddress = billingAddress; }
    }
}

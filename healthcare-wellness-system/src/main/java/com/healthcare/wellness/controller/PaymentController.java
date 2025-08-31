package com.healthcare.wellness.controller;

import com.healthcare.wellness.dto.PaymentRequest;
import com.healthcare.wellness.entity.Payment;
import com.healthcare.wellness.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {
    
    private final PaymentService paymentService;
    
    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Payment> processPayment(@Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(paymentService.processPayment(request));
    }
    
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('PATIENT', 'PROVIDER', 'ADMIN')")
    public ResponseEntity<List<Payment>> getPaymentsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(paymentService.getPaymentsByPatient(patientId));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('PATIENT', 'PROVIDER', 'ADMIN')")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Payment> updatePaymentStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(paymentService.updatePaymentStatus(id, status));
    }
    
    @GetMapping("/appointment/{appointmentId}")
    @PreAuthorize("hasAnyRole('PATIENT', 'PROVIDER', 'ADMIN')")
    public ResponseEntity<Payment> getPaymentByAppointment(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(paymentService.getPaymentByAppointment(appointmentId));
    }
}

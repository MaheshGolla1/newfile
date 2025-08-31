package com.healthcare.wellness.controller;

import com.healthcare.wellness.dto.EnrollmentRequest;
import com.healthcare.wellness.entity.Enrollment;
import com.healthcare.wellness.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EnrollmentController {
    
    private final EnrollmentService enrollmentService;
    
    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Enrollment> createEnrollment(@Valid @RequestBody EnrollmentRequest request) {
        return ResponseEntity.ok(enrollmentService.createEnrollment(request));
    }
    
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('PATIENT', 'PROVIDER', 'ADMIN')")
    public ResponseEntity<List<Enrollment>> getEnrollmentsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentsByPatient(patientId));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('PATIENT', 'PROVIDER', 'ADMIN')")
    public ResponseEntity<Enrollment> getEnrollmentById(@PathVariable Long id) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentById(id));
    }
    
    @PutMapping("/{id}/progress")
    @PreAuthorize("hasAnyRole('PATIENT', 'PROVIDER', 'ADMIN')")
    public ResponseEntity<Enrollment> updateProgress(@PathVariable Long id, @RequestParam int progress) {
        return ResponseEntity.ok(enrollmentService.updateProgress(id, progress));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Void> cancelEnrollment(@PathVariable Long id) {
        enrollmentService.cancelEnrollment(id);
        return ResponseEntity.ok().build();
    }
}

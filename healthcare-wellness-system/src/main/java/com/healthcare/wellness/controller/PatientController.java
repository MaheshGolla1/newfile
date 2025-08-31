package com.healthcare.wellness.controller;

import com.healthcare.wellness.entity.Patient;
import com.healthcare.wellness.service.PatientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Patients", description = "Patient profile and management operations")
@SecurityRequirement(name = "Bearer Authentication")
public class PatientController {
    
    private final PatientService patientService;
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('PATIENT', 'PROVIDER', 'ADMIN') or #id == authentication.principal.id")
    @Operation(summary = "Get patient by ID", description = "Retrieve patient details by patient ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Patient found",
            content = @Content(schema = @Schema(implementation = Patient.class))),
        @ApiResponse(responseCode = "404", description = "Patient not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Patient> getPatientById(
            @Parameter(description = "Patient ID", example = "1") @PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('PATIENT', 'ADMIN') or #id == authentication.principal.id")
    @Operation(summary = "Update patient", description = "Update patient profile information")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Patient updated successfully",
            content = @Content(schema = @Schema(implementation = Patient.class))),
        @ApiResponse(responseCode = "404", description = "Patient not found"),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Patient> updatePatient(
            @Parameter(description = "Patient ID", example = "1") @PathVariable Long id,
            @Valid @RequestBody Patient patient) {
        return ResponseEntity.ok(patientService.updatePatient(id, patient));
    }
    
    @GetMapping("/profile")
    @PreAuthorize("hasRole('PATIENT')")
    @Operation(summary = "Get current patient profile", description = "Retrieve current authenticated patient's profile")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Patient profile retrieved",
            content = @Content(schema = @Schema(implementation = Patient.class))),
        @ApiResponse(responseCode = "403", description = "Access denied - Patient role required")
    })
    public ResponseEntity<Patient> getCurrentPatientProfile() {
        return ResponseEntity.ok(patientService.getCurrentPatient());
    }
    
    @PutMapping("/profile")
    @PreAuthorize("hasRole('PATIENT')")
    @Operation(summary = "Update current patient profile", description = "Update current authenticated patient's profile")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Profile updated successfully",
            content = @Content(schema = @Schema(implementation = Patient.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "403", description = "Access denied - Patient role required")
    })
    public ResponseEntity<Patient> updateCurrentPatientProfile(@Valid @RequestBody Patient patient) {
        return ResponseEntity.ok(patientService.updateCurrentPatient(patient));
    }
}

package com.healthcare.wellness.controller;

import com.healthcare.wellness.entity.Appointment;
import com.healthcare.wellness.entity.AppointmentStatus;
import com.healthcare.wellness.service.AppointmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
@Tag(name = "Appointments", description = "Appointment booking and management operations")
@SecurityRequirement(name = "Bearer Authentication")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping
    @PreAuthorize("hasAnyRole('PATIENT', 'PROVIDER', 'ADMIN')")
    @Operation(summary = "Get all appointments", description = "Retrieve all appointments (Admin access)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Appointments retrieved successfully",
            content = @Content(schema = @Schema(implementation = Appointment.class))),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('PATIENT', 'PROVIDER', 'ADMIN')")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        return appointmentService.getAppointmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('PATIENT', 'ADMIN')")
    public ResponseEntity<List<Appointment>> getAppointmentsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatient(patientId));
    }

    @GetMapping("/provider/{providerId}")
    @PreAuthorize("hasAnyRole('PROVIDER', 'ADMIN')")
    public ResponseEntity<List<Appointment>> getAppointmentsByProvider(@PathVariable Long providerId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByProvider(providerId));
    }

    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment) {
        return ResponseEntity.ok(appointmentService.createAppointment(appointment));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('PATIENT', 'PROVIDER', 'ADMIN')")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable Long id, @RequestBody Appointment appointment) {
        return ResponseEntity.ok(appointmentService.updateAppointment(id, appointment));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('PROVIDER', 'ADMIN')")
    public ResponseEntity<Appointment> updateAppointmentStatus(
            @PathVariable Long id, 
            @RequestParam AppointmentStatus status) {
        return ResponseEntity.ok(appointmentService.updateAppointmentStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('PATIENT', 'PROVIDER', 'ADMIN')")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/available-slots")
    @PreAuthorize("hasAnyRole('PATIENT', 'PROVIDER', 'ADMIN')")
    public ResponseEntity<List<String>> getAvailableSlots(
            @RequestParam Long providerId,
            @RequestParam String date) {
        return ResponseEntity.ok(appointmentService.getAvailableSlots(providerId, date));
    }
}

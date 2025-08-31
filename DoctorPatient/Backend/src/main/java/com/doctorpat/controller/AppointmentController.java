package com.doctorpat.controller;

import com.doctorpat.entity.Appointment;
import com.doctorpat.entity.User;
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
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/appointments")
@Tag(name = "Appointment Management", description = "Appointment management APIs")
@CrossOrigin(origins = "*")
public class AppointmentController {
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping
    @Operation(
        summary = "Get All Appointments",
        description = "Retrieve all appointments from the system"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Appointments retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        return ResponseEntity.ok(appointments);
    }
    
    @GetMapping("/{id}")
    @Operation(
        summary = "Get Appointment by ID",
        description = "Retrieve a specific appointment by its ID"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Appointment found"),
        @ApiResponse(responseCode = "404", description = "Appointment not found")
    })
    public ResponseEntity<Appointment> getAppointmentById(
        @Parameter(description = "Appointment ID", required = true)
        @PathVariable Long id) {
        
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        return appointment.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/patient/{patientId}")
    @Operation(
        summary = "Get Appointments by Patient",
        description = "Retrieve all appointments for a specific patient"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Appointments retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Patient not found")
    })
    public ResponseEntity<List<Appointment>> getAppointmentsByPatient(
        @Parameter(description = "Patient ID", required = true)
        @PathVariable Long patientId) {
        
        Optional<User> patient = userRepository.findById(patientId);
        if (patient.isPresent()) {
            List<Appointment> appointments = appointmentRepository.findByPatient(patient.get());
            return ResponseEntity.ok(appointments);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/doctor/{doctorId}")
    @Operation(
        summary = "Get Appointments by Doctor",
        description = "Retrieve all appointments for a specific doctor"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Appointments retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Doctor not found")
    })
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctor(
        @Parameter(description = "Doctor ID", required = true)
        @PathVariable Long doctorId) {
        
        Optional<User> doctor = userRepository.findById(doctorId);
        if (doctor.isPresent()) {
            List<Appointment> appointments = appointmentRepository.findByDoctor(doctor.get());
            return ResponseEntity.ok(appointments);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/status/{status}")
    @Operation(
        summary = "Get Appointments by Status",
        description = "Retrieve all appointments with a specific status"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Appointments retrieved successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid status")
    })
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<List<Appointment>> getAppointmentsByStatus(
        @Parameter(description = "Appointment status", required = true)
        @PathVariable String status) {
        
        try {
            Appointment.AppointmentStatus appointmentStatus = Appointment.AppointmentStatus.valueOf(status.toUpperCase());
            List<Appointment> appointments = appointmentRepository.findByStatus(appointmentStatus);
            return ResponseEntity.ok(appointments);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping
    @Operation(
        summary = "Create Appointment",
        description = "Create a new appointment"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Appointment created successfully"),
        @ApiResponse(responseCode = "400", description = "Bad request"),
        @ApiResponse(responseCode = "404", description = "Patient or doctor not found")
    })
    public ResponseEntity<Appointment> createAppointment(
        @Parameter(description = "Appointment details", required = true)
        @RequestBody Appointment appointment) {
        
        // Validate patient and doctor exist
        Optional<User> patient = userRepository.findById(appointment.getPatient().getId());
        Optional<User> doctor = userRepository.findById(appointment.getDoctor().getId());
        
        if (patient.isEmpty() || doctor.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        // Check for scheduling conflicts
        List<Appointment> conflicts = appointmentRepository.findByDoctorAndDateTime(
            doctor.get(), appointment.getAppointmentDate(), appointment.getAppointmentTime());
        
        if (!conflicts.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        appointment.setPatient(patient.get());
        appointment.setDoctor(doctor.get());
        appointment.setStatus(Appointment.AppointmentStatus.SCHEDULED);
        appointment.setPaymentStatus(Appointment.PaymentStatus.PENDING);
        
        Appointment savedAppointment = appointmentRepository.save(appointment);
        return ResponseEntity.ok(savedAppointment);
    }
    
    @PutMapping("/{id}")
    @Operation(
        summary = "Update Appointment",
        description = "Update an existing appointment"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Appointment updated successfully"),
        @ApiResponse(responseCode = "404", description = "Appointment not found"),
        @ApiResponse(responseCode = "400", description = "Bad request")
    })
    public ResponseEntity<Appointment> updateAppointment(
        @Parameter(description = "Appointment ID", required = true)
        @PathVariable Long id,
        @Parameter(description = "Updated appointment details", required = true)
        @RequestBody Appointment appointmentDetails) {
        
        Optional<Appointment> appointmentOptional = appointmentRepository.findById(id);
        if (appointmentOptional.isPresent()) {
            Appointment appointment = appointmentOptional.get();
            
            appointment.setAppointmentDate(appointmentDetails.getAppointmentDate());
            appointment.setAppointmentTime(appointmentDetails.getAppointmentTime());
            appointment.setStatus(appointmentDetails.getStatus());
            appointment.setNotes(appointmentDetails.getNotes());
            appointment.setConsultationFee(appointmentDetails.getConsultationFee());
            
            Appointment updatedAppointment = appointmentRepository.save(appointment);
            return ResponseEntity.ok(updatedAppointment);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}/status")
    @Operation(
        summary = "Update Appointment Status",
        description = "Update the status of an appointment"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Status updated successfully"),
        @ApiResponse(responseCode = "404", description = "Appointment not found"),
        @ApiResponse(responseCode = "400", description = "Invalid status")
    })
    public ResponseEntity<Appointment> updateAppointmentStatus(
        @Parameter(description = "Appointment ID", required = true)
        @PathVariable Long id,
        @Parameter(description = "New status", required = true)
        @RequestParam String status) {
        
        Optional<Appointment> appointmentOptional = appointmentRepository.findById(id);
        if (appointmentOptional.isPresent()) {
            try {
                Appointment.AppointmentStatus appointmentStatus = Appointment.AppointmentStatus.valueOf(status.toUpperCase());
                Appointment appointment = appointmentOptional.get();
                appointment.setStatus(appointmentStatus);
                
                Appointment updatedAppointment = appointmentRepository.save(appointment);
                return ResponseEntity.ok(updatedAppointment);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    @Operation(
        summary = "Cancel Appointment",
        description = "Cancel an appointment"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Appointment cancelled successfully"),
        @ApiResponse(responseCode = "404", description = "Appointment not found")
    })
    public ResponseEntity<Appointment> cancelAppointment(
        @Parameter(description = "Appointment ID", required = true)
        @PathVariable Long id,
        @Parameter(description = "Cancellation reason")
        @RequestParam(required = false) String reason) {
        
        Optional<Appointment> appointmentOptional = appointmentRepository.findById(id);
        if (appointmentOptional.isPresent()) {
            Appointment appointment = appointmentOptional.get();
            appointment.setStatus(Appointment.AppointmentStatus.CANCELLED);
            appointment.setCancellationReason(reason);
            
            Appointment updatedAppointment = appointmentRepository.save(appointment);
            return ResponseEntity.ok(updatedAppointment);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/stats")
    @Operation(
        summary = "Get Appointment Statistics",
        description = "Get statistics about appointments in the system"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Statistics retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> getAppointmentStats() {
        Long scheduledCount = appointmentRepository.countByStatus(Appointment.AppointmentStatus.SCHEDULED);
        Long completedCount = appointmentRepository.countByStatus(Appointment.AppointmentStatus.COMPLETED);
        Long cancelledCount = appointmentRepository.countByStatus(Appointment.AppointmentStatus.CANCELLED);
        Long pendingPaymentCount = appointmentRepository.countByPaymentStatus(Appointment.PaymentStatus.PENDING);
        Long paidCount = appointmentRepository.countByPaymentStatus(Appointment.PaymentStatus.PAID);
        
        return ResponseEntity.ok(Map.of(
            "scheduled", scheduledCount,
            "completed", completedCount,
            "cancelled", cancelledCount,
            "pendingPayment", pendingPaymentCount,
            "paid", paidCount
        ));
    }
}

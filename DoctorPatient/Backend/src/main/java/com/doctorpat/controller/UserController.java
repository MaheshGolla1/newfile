package com.doctorpat.controller;

import com.doctorpat.entity.User;
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

import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/users")
@Tag(name = "User Management", description = "User management APIs")
@CrossOrigin(origins = "*")
public class UserController {
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping
    @Operation(
        summary = "Get All Users",
        description = "Retrieve all users from the system"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Users retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/{id}")
    @Operation(
        summary = "Get User by ID",
        description = "Retrieve a specific user by their ID"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User found"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<User> getUserById(
        @Parameter(description = "User ID", required = true)
        @PathVariable Long id) {
        
        Optional<User> user = userRepository.findById(id);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/role/{role}")
    @Operation(
        summary = "Get Users by Role",
        description = "Retrieve all users with a specific role"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Users retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getUsersByRole(
        @Parameter(description = "User role (PATIENT, DOCTOR, ADMIN)", required = true)
        @PathVariable String role) {
        
        try {
            User.UserRole userRole = User.UserRole.valueOf(role.toUpperCase());
            List<User> users = userRepository.findByRole(userRole);
            return ResponseEntity.ok(users);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/doctors")
    @Operation(
        summary = "Get All Doctors",
        description = "Retrieve all active doctors from the system"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Doctors retrieved successfully")
    })
    public ResponseEntity<List<User>> getAllDoctors() {
        List<User> doctors = userRepository.findAllActiveDoctors();
        return ResponseEntity.ok(doctors);
    }
    
    @GetMapping("/doctors/specialization/{specialization}")
    @Operation(
        summary = "Get Doctors by Specialization",
        description = "Retrieve all doctors with a specific specialization"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Doctors retrieved successfully")
    })
    public ResponseEntity<List<User>> getDoctorsBySpecialization(
        @Parameter(description = "Doctor specialization", required = true)
        @PathVariable String specialization) {
        
        List<User> doctors = userRepository.findDoctorsBySpecialization(specialization);
        return ResponseEntity.ok(doctors);
    }
    
    @GetMapping("/patients")
    @Operation(
        summary = "Get All Patients",
        description = "Retrieve all active patients from the system"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Patients retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<List<User>> getAllPatients() {
        List<User> patients = userRepository.findAllActivePatients();
        return ResponseEntity.ok(patients);
    }
    
    @PutMapping("/{id}")
    @Operation(
        summary = "Update User",
        description = "Update an existing user's information"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User updated successfully"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "400", description = "Bad request")
    })
    public ResponseEntity<User> updateUser(
        @Parameter(description = "User ID", required = true)
        @PathVariable Long id,
        @Parameter(description = "Updated user information", required = true)
        @RequestBody User userDetails) {
        
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setName(userDetails.getName());
            user.setPhoneNumber(userDetails.getPhoneNumber());
            user.setProfileImage(userDetails.getProfileImage());
            
            // Update role-specific fields
            if (user.getRole() == User.UserRole.PATIENT) {
                user.setAddress(userDetails.getAddress());
                user.setDateOfBirth(userDetails.getDateOfBirth());
                user.setGender(userDetails.getGender());
            } else if (user.getRole() == User.UserRole.DOCTOR) {
                user.setSpecialization(userDetails.getSpecialization());
                user.setLicenseNumber(userDetails.getLicenseNumber());
                user.setYearsOfExperience(userDetails.getYearsOfExperience());
                user.setConsultationFee(userDetails.getConsultationFee());
            }
            
            User updatedUser = userRepository.save(user);
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    @Operation(
        summary = "Delete User",
        description = "Delete a user from the system (soft delete)"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User deleted successfully"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(
        @Parameter(description = "User ID", required = true)
        @PathVariable Long id) {
        
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setIsActive(false);
            userRepository.save(user);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/stats")
    @Operation(
        summary = "Get User Statistics",
        description = "Get statistics about users in the system"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Statistics retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> getUserStats() {
        Long totalPatients = userRepository.countByRole(User.UserRole.PATIENT);
        Long totalDoctors = userRepository.countByRole(User.UserRole.DOCTOR);
        Long totalAdmins = userRepository.countByRole(User.UserRole.ADMIN);
        Long activePatients = userRepository.countActiveByRole(User.UserRole.PATIENT);
        Long activeDoctors = userRepository.countActiveByRole(User.UserRole.DOCTOR);
        
        return ResponseEntity.ok(Map.of(
            "totalPatients", totalPatients,
            "totalDoctors", totalDoctors,
            "totalAdmins", totalAdmins,
            "activePatients", activePatients,
            "activeDoctors", activeDoctors
        ));
    }
}

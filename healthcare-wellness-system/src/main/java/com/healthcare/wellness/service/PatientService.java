package com.healthcare.wellness.service;

import com.healthcare.wellness.entity.Patient;
import com.healthcare.wellness.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PatientService {
    
    private final PatientRepository patientRepository;
    
    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }
    
    public Patient updatePatient(Long id, Patient patientDetails) {
        return patientRepository.findById(id)
                .map(patient -> {
                    patient.setName(patientDetails.getName());
                    patient.setEmail(patientDetails.getEmail());
                    patient.setPhone(patientDetails.getPhone());
                    patient.setAddress(patientDetails.getAddress());
                    patient.setDob(patientDetails.getDob());
                    patient.setGender(patientDetails.getGender());
                    return patientRepository.save(patient);
                })
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }
    
    public Patient getCurrentPatient() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return patientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Current patient not found"));
    }
    
    public Patient updateCurrentPatient(Patient patientDetails) {
        Patient currentPatient = getCurrentPatient();
        
        currentPatient.setName(patientDetails.getName());
        currentPatient.setEmail(patientDetails.getEmail());
        currentPatient.setPhone(patientDetails.getPhone());
        currentPatient.setAddress(patientDetails.getAddress());
        currentPatient.setDob(patientDetails.getDob());
        currentPatient.setGender(patientDetails.getGender());
        
        return patientRepository.save(currentPatient);
    }
}

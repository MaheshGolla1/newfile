package com.healthcare.wellness.service;

import com.healthcare.wellness.dto.EnrollmentRequest;
import com.healthcare.wellness.entity.Enrollment;
import com.healthcare.wellness.entity.EnrollmentStatus;
import com.healthcare.wellness.entity.Patient;
import com.healthcare.wellness.entity.WellnessService;
import com.healthcare.wellness.repository.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EnrollmentService {
    
    private final EnrollmentRepository enrollmentRepository;
    private final PatientService patientService;
    private final WellnessServiceService wellnessServiceService;
    
    public Enrollment createEnrollment(EnrollmentRequest request) {
        Patient currentPatient = patientService.getCurrentPatient();
        WellnessService service = wellnessServiceService.getServiceById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));
        
        Enrollment enrollment = new Enrollment();
        enrollment.setPatient(currentPatient);
        enrollment.setService(service);
        enrollment.setStartDate(request.getStartDate());
        enrollment.setEndDate(request.getEndDate());
        enrollment.setProgressPercentage(0);
        enrollment.setStatus(EnrollmentStatus.ACTIVE);
        
        return enrollmentRepository.save(enrollment);
    }
    
    public List<Enrollment> getEnrollmentsByPatient(Long patientId) {
        return enrollmentRepository.findByPatientId(patientId);
    }
    
    public Enrollment getEnrollmentById(Long id) {
        return enrollmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
    }
    
    public Enrollment updateProgress(Long id, int progress) {
        return enrollmentRepository.findById(id)
                .map(enrollment -> {
                    enrollment.setProgressPercentage(progress);
                    if (progress >= 100) {
                        enrollment.setStatus(EnrollmentStatus.COMPLETED);
                    }
                    return enrollmentRepository.save(enrollment);
                })
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
    }
    
    public void cancelEnrollment(Long id) {
        Enrollment enrollment = getEnrollmentById(id);
        enrollment.setStatus(EnrollmentStatus.CANCELLED);
        enrollmentRepository.save(enrollment);
    }
}

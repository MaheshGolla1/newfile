package com.healthcare.wellness.repository;

import com.healthcare.wellness.entity.Enrollment;
import com.healthcare.wellness.entity.EnrollmentStatus;
import com.healthcare.wellness.entity.Patient;
import com.healthcare.wellness.entity.WellnessService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    
    List<Enrollment> findByPatient(Patient patient);
    
    List<Enrollment> findByService(WellnessService service);
    
    List<Enrollment> findByPatientAndStatus(Patient patient, EnrollmentStatus status);
    
    List<Enrollment> findByServiceAndStatus(WellnessService service, EnrollmentStatus status);
    
    List<Enrollment> findByPatientId(Long patientId);
}

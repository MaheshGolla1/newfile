package com.healthcare.wellness.repository;

import com.healthcare.wellness.entity.Payment;
import com.healthcare.wellness.entity.PaymentStatus;
import com.healthcare.wellness.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    List<Payment> findByPatient(Patient patient);
    
    List<Payment> findByPaymentStatus(PaymentStatus status);
    
    List<Payment> findByPatientAndPaymentStatus(Patient patient, PaymentStatus status);
    
    List<Payment> findByPaymentDateBetween(LocalDateTime start, LocalDateTime end);
    
    List<Payment> findByPatientId(Long patientId);
    
    List<Payment> findByAppointmentId(Long appointmentId);
}

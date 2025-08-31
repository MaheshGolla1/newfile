package com.healthcare.wellness.repository;

import com.healthcare.wellness.entity.Appointment;
import com.healthcare.wellness.entity.AppointmentStatus;
import com.healthcare.wellness.entity.Patient;
import com.healthcare.wellness.entity.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    List<Appointment> findByPatient(Patient patient);
    
    List<Appointment> findByProvider(Provider provider);
    
    List<Appointment> findByPatientAndStatus(Patient patient, AppointmentStatus status);
    
    List<Appointment> findByProviderAndStatus(Provider provider, AppointmentStatus status);
    
    List<Appointment> findByAppointmentDateBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT a FROM Appointment a WHERE a.provider = :provider AND a.appointmentDate >= :startDate AND a.appointmentDate <= :endDate")
    List<Appointment> findProviderAppointmentsInDateRange(@Param("provider") Provider provider, 
                                                         @Param("startDate") LocalDateTime startDate, 
                                                         @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT a FROM Appointment a WHERE a.patient = :patient AND a.appointmentDate >= :startDate AND a.appointmentDate <= :endDate")
    List<Appointment> findPatientAppointmentsInDateRange(@Param("patient") Patient patient, 
                                                        @Param("startDate") LocalDateTime startDate, 
                                                        @Param("endDate") LocalDateTime endDate);
    
    // Additional methods for service layer
    List<Appointment> findByPatientId(Long patientId);
    
    List<Appointment> findByProviderId(Long providerId);
    
    List<Appointment> findByProviderIdAndAppointmentDate(Long providerId, LocalDate appointmentDate);
}

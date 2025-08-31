package com.doctorpat.repository;

import com.doctorpat.entity.Appointment;
import com.doctorpat.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    List<Appointment> findByPatient(User patient);
    
    List<Appointment> findByDoctor(User doctor);
    
    List<Appointment> findByPatientAndStatus(User patient, Appointment.AppointmentStatus status);
    
    List<Appointment> findByDoctorAndStatus(User doctor, Appointment.AppointmentStatus status);
    
    List<Appointment> findByPatientAndAppointmentDate(User patient, LocalDate appointmentDate);
    
    List<Appointment> findByDoctorAndAppointmentDate(User doctor, LocalDate appointmentDate);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctor = :doctor AND a.appointmentDate = :date AND a.appointmentTime = :time")
    List<Appointment> findByDoctorAndDateTime(@Param("doctor") User doctor, 
                                             @Param("date") LocalDate date, 
                                             @Param("time") LocalTime time);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctor = :doctor AND a.appointmentDate >= :startDate AND a.appointmentDate <= :endDate")
    List<Appointment> findByDoctorAndDateRange(@Param("doctor") User doctor, 
                                              @Param("startDate") LocalDate startDate, 
                                              @Param("endDate") LocalDate endDate);
    
    @Query("SELECT a FROM Appointment a WHERE a.patient = :patient AND a.appointmentDate >= :startDate AND a.appointmentDate <= :endDate")
    List<Appointment> findByPatientAndDateRange(@Param("patient") User patient, 
                                               @Param("startDate") LocalDate startDate, 
                                               @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.doctor = :doctor AND a.appointmentDate = :date")
    Long countByDoctorAndDate(@Param("doctor") User doctor, @Param("date") LocalDate date);
    
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.status = :status")
    Long countByStatus(@Param("status") Appointment.AppointmentStatus status);
    
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.paymentStatus = :paymentStatus")
    Long countByPaymentStatus(@Param("paymentStatus") Appointment.PaymentStatus paymentStatus);
    
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate < :date AND a.status = 'SCHEDULED'")
    List<Appointment> findOverdueAppointments(@Param("date") LocalDate date);
}

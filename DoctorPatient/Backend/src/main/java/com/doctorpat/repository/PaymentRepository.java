package com.doctorpat.repository;

import com.doctorpat.entity.Payment;
import com.doctorpat.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    List<Payment> findByPatient(User patient);
    
    List<Payment> findByDoctor(User doctor);
    
    List<Payment> findByStatus(Payment.PaymentStatus status);
    
    List<Payment> findByPaymentMethod(Payment.PaymentMethod paymentMethod);
    
    Optional<Payment> findByTransactionId(String transactionId);
    
    @Query("SELECT p FROM Payment p WHERE p.patient = :patient AND p.status = :status")
    List<Payment> findByPatientAndStatus(@Param("patient") User patient, 
                                        @Param("status") Payment.PaymentStatus status);
    
    @Query("SELECT p FROM Payment p WHERE p.doctor = :doctor AND p.status = :status")
    List<Payment> findByDoctorAndStatus(@Param("doctor") User doctor, 
                                       @Param("status") Payment.PaymentStatus status);
    
    @Query("SELECT p FROM Payment p WHERE p.createdAt >= :startDate AND p.createdAt <= :endDate")
    List<Payment> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                 @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT p FROM Payment p WHERE p.patient = :patient AND p.createdAt >= :startDate AND p.createdAt <= :endDate")
    List<Payment> findByPatientAndDateRange(@Param("patient") User patient, 
                                           @Param("startDate") LocalDateTime startDate, 
                                           @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT p FROM Payment p WHERE p.doctor = :doctor AND p.createdAt >= :startDate AND p.createdAt <= :endDate")
    List<Payment> findByDoctorAndDateRange(@Param("doctor") User doctor, 
                                          @Param("startDate") LocalDateTime startDate, 
                                          @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED' AND p.createdAt >= :startDate AND p.createdAt <= :endDate")
    BigDecimal getTotalRevenue(@Param("startDate") LocalDateTime startDate, 
                              @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.doctor = :doctor AND p.status = 'COMPLETED' AND p.createdAt >= :startDate AND p.createdAt <= :endDate")
    BigDecimal getDoctorRevenue(@Param("doctor") User doctor, 
                               @Param("startDate") LocalDateTime startDate, 
                               @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = :status")
    Long countByStatus(@Param("status") Payment.PaymentStatus status);
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.paymentMethod = :paymentMethod")
    Long countByPaymentMethod(@Param("paymentMethod") Payment.PaymentMethod paymentMethod);
}

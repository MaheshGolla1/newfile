package com.doctorpat.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "appointments")
public class Appointment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private User doctor;
    
    @NotNull(message = "Appointment date is required")
    @Column(name = "appointment_date", nullable = false)
    private LocalDate appointmentDate;
    
    @NotNull(message = "Appointment time is required")
    @Column(name = "appointment_time", nullable = false)
    private LocalTime appointmentTime;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status = AppointmentStatus.SCHEDULED;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "consultation_fee")
    private Double consultationFee;
    
    @Column(name = "appointment_duration")
    private Integer appointmentDuration = 30; // in minutes
    
    @Column(name = "cancellation_reason")
    private String cancellationReason;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Enums
    public enum AppointmentStatus {
        SCHEDULED, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW
    }
    
    public enum PaymentStatus {
        PENDING, PAID, REFUNDED, CANCELLED
    }
    
    // Constructors
    public Appointment() {}
    
    public Appointment(User patient, User doctor, LocalDate appointmentDate, LocalTime appointmentTime) {
        this.patient = patient;
        this.doctor = doctor;
        this.appointmentDate = appointmentDate;
        this.appointmentTime = appointmentTime;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getPatient() {
        return patient;
    }
    
    public void setPatient(User patient) {
        this.patient = patient;
    }
    
    public User getDoctor() {
        return doctor;
    }
    
    public void setDoctor(User doctor) {
        this.doctor = doctor;
    }
    
    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }
    
    public void setAppointmentDate(LocalDate appointmentDate) {
        this.appointmentDate = appointmentDate;
    }
    
    public LocalTime getAppointmentTime() {
        return appointmentTime;
    }
    
    public void setAppointmentTime(LocalTime appointmentTime) {
        this.appointmentTime = appointmentTime;
    }
    
    public AppointmentStatus getStatus() {
        return status;
    }
    
    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }
    
    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }
    
    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public Double getConsultationFee() {
        return consultationFee;
    }
    
    public void setConsultationFee(Double consultationFee) {
        this.consultationFee = consultationFee;
    }
    
    public Integer getAppointmentDuration() {
        return appointmentDuration;
    }
    
    public void setAppointmentDuration(Integer appointmentDuration) {
        this.appointmentDuration = appointmentDuration;
    }
    
    public String getCancellationReason() {
        return cancellationReason;
    }
    
    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

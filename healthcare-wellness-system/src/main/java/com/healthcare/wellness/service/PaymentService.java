package com.healthcare.wellness.service;

import com.healthcare.wellness.dto.PaymentRequest;
import com.healthcare.wellness.entity.Appointment;
import com.healthcare.wellness.entity.Patient;
import com.healthcare.wellness.entity.Payment;
import com.healthcare.wellness.entity.PaymentStatus;
import com.healthcare.wellness.entity.WellnessService;
import com.healthcare.wellness.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final AppointmentService appointmentService;
    private final WellnessServiceService wellnessServiceService;
    private final PatientService patientService;
    
    public Payment processPayment(PaymentRequest request) {
        Patient currentPatient = patientService.getCurrentPatient();
        Appointment appointment = appointmentService.getAppointmentById(request.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        WellnessService service = wellnessServiceService.getServiceById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));
        
        Payment payment = new Payment();
        payment.setPatient(currentPatient);
        payment.setAppointment(appointment);
        payment.setService(service);
        payment.setAmount(service.getFee());
        payment.setPaymentStatus(PaymentStatus.PENDING);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setTransactionId(request.getTransactionId());
        
        return paymentRepository.save(payment);
    }
    
    public List<Payment> getPaymentsByPatient(Long patientId) {
        return paymentRepository.findByPatientId(patientId);
    }
    
    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }
    
    public Payment updatePaymentStatus(Long id, String status) {
        return paymentRepository.findById(id)
                .map(payment -> {
                    payment.setPaymentStatus(PaymentStatus.valueOf(status.toUpperCase()));
                    return paymentRepository.save(payment);
                })
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }
    
    public List<Payment> getPaymentsByAppointment(Long appointmentId) {
        return paymentRepository.findByAppointmentId(appointmentId);
    }
}

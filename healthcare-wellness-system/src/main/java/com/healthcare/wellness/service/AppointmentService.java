package com.healthcare.wellness.service;

import com.healthcare.wellness.entity.Appointment;
import com.healthcare.wellness.entity.AppointmentStatus;
import com.healthcare.wellness.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    public List<Appointment> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsByProvider(Long providerId) {
        return appointmentRepository.findByProviderId(providerId);
    }

    public Appointment createAppointment(Appointment appointment) {
        // Set default status if not provided
        if (appointment.getStatus() == null) {
            appointment.setStatus(AppointmentStatus.PENDING);
        }
        return appointmentRepository.save(appointment);
    }

    public Appointment updateAppointment(Long id, Appointment appointmentDetails) {
        return appointmentRepository.findById(id)
                .map(appointment -> {
                    appointment.setPatient(appointmentDetails.getPatient());
                    appointment.setProvider(appointmentDetails.getProvider());
                    appointment.setAppointmentDate(appointmentDetails.getAppointmentDate());
                    appointment.setStatus(appointmentDetails.getStatus());
                    appointment.setNotes(appointmentDetails.getNotes());
                    return appointmentRepository.save(appointment);
                })
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
    }

    public Appointment updateAppointmentStatus(Long id, AppointmentStatus status) {
        return appointmentRepository.findById(id)
                .map(appointment -> {
                    appointment.setStatus(status);
                    return appointmentRepository.save(appointment);
                })
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
    }

    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }

    public List<String> getAvailableSlots(Long providerId, String date) {
        LocalDate appointmentDate = LocalDate.parse(date);
        
        // Get existing appointments for the provider on the given date
        List<Appointment> existingAppointments = appointmentRepository
                .findByProviderIdAndAppointmentDate(providerId, appointmentDate);
        
        // Define business hours (9 AM to 6 PM)
        LocalTime startTime = LocalTime.of(9, 0);
        LocalTime endTime = LocalTime.of(18, 0);
        
        // Generate all possible 30-minute slots
        List<String> allSlots = generateTimeSlots(startTime, endTime, 30);
        
        // Remove booked slots
        List<String> bookedSlots = existingAppointments.stream()
                .map(appointment -> appointment.getAppointmentDate().toLocalTime().format(DateTimeFormatter.ofPattern("HH:mm")))
                .collect(Collectors.toList());
        
        return allSlots.stream()
                .filter(slot -> !bookedSlots.contains(slot))
                .collect(Collectors.toList());
    }

    private List<String> generateTimeSlots(LocalTime start, LocalTime end, int intervalMinutes) {
        List<String> slots = new java.util.ArrayList<>();
        LocalTime current = start;
        
        while (current.isBefore(end)) {
            slots.add(current.format(DateTimeFormatter.ofPattern("HH:mm")));
            current = current.plusMinutes(intervalMinutes);
        }
        
        return slots;
    }
}

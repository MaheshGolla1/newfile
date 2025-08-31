package com.healthcare.wellness.service;

import com.healthcare.wellness.entity.WellnessService;
import com.healthcare.wellness.repository.WellnessServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WellnessServiceService {

    @Autowired
    private WellnessServiceRepository wellnessServiceRepository;

    public List<WellnessService> getAllServices() {
        return wellnessServiceRepository.findAll();
    }

    public Optional<WellnessService> getServiceById(Long id) {
        return wellnessServiceRepository.findById(id);
    }

    public List<WellnessService> getServicesByCategory(String category) {
        return wellnessServiceRepository.findByCategory(category);
    }

    public List<WellnessService> getServicesByProvider(Long providerId) {
        return wellnessServiceRepository.findByProviderId(providerId);
    }

    public WellnessService createService(WellnessService service) {
        return wellnessServiceRepository.save(service);
    }

    public WellnessService updateService(Long id, WellnessService serviceDetails) {
        return wellnessServiceRepository.findById(id)
                .map(service -> {
                    service.setName(serviceDetails.getName());
                    service.setDescription(serviceDetails.getDescription());
                    service.setCategory(serviceDetails.getCategory());
                    service.setDuration(serviceDetails.getDuration());
                    service.setFee(serviceDetails.getFee());
                    return wellnessServiceRepository.save(service);
                })
                .orElseThrow(() -> new RuntimeException("Service not found"));
    }

    public void deleteService(Long id) {
        wellnessServiceRepository.deleteById(id);
    }

    public List<WellnessService> searchServices(String query) {
        return wellnessServiceRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
    }

    public List<String> getAllCategories() {
        return wellnessServiceRepository.findAll().stream()
                .map(service -> service.getCategory())
                .filter(category -> category != null)
                .distinct()
                .collect(Collectors.toList());
    }
}

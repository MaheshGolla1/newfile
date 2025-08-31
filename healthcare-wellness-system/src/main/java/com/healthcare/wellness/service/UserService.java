package com.healthcare.wellness.service;

import com.healthcare.wellness.entity.User;
import com.healthcare.wellness.entity.UserRole;
import com.healthcare.wellness.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }

    public User updateCurrentUser(User userDetails) {
        User currentUser = getCurrentUser();
        
        currentUser.setName(userDetails.getName());
        currentUser.setEmail(userDetails.getEmail());
        currentUser.setPhone(userDetails.getPhone());
        
        return userRepository.save(currentUser);
    }

    public User updateUser(Long id, User userDetails) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setName(userDetails.getName());
                    user.setEmail(userDetails.getEmail());
                    user.setPhone(userDetails.getPhone());
                    user.setRole(userDetails.getRole());
                    user.setActive(userDetails.isActive());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public List<User> getUsersByRole(String role) {
        UserRole userRole = UserRole.valueOf(role.toUpperCase());
        return userRepository.findByRole(userRole);
    }

    public User updateUserStatus(Long id, boolean active) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setActive(active);
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}

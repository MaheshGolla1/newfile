package com.doctorpat.repository;

import com.doctorpat.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByEmailAndIsActiveTrue(String email);
    
    List<User> findByRole(User.UserRole role);
    
    List<User> findByRoleAndIsActiveTrue(User.UserRole role);
    
    @Query("SELECT u FROM User u WHERE u.role = 'DOCTOR' AND u.isActive = true")
    List<User> findAllActiveDoctors();
    
    @Query("SELECT u FROM User u WHERE u.role = 'PATIENT' AND u.isActive = true")
    List<User> findAllActivePatients();
    
    @Query("SELECT u FROM User u WHERE u.specialization = :specialization AND u.role = 'DOCTOR' AND u.isActive = true")
    List<User> findDoctorsBySpecialization(@Param("specialization") String specialization);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    Long countByRole(@Param("role") User.UserRole role);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.isActive = true")
    Long countActiveByRole(@Param("role") User.UserRole role);
    
    boolean existsByEmail(String email);
    
    boolean existsByEmailAndIdNot(String email, Long id);
}

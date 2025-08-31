-- Healthcare & Wellness Management System Database Schema
-- MySQL Database Creation Script

-- Create database
CREATE DATABASE IF NOT EXISTS healthcare_wellness;
USE healthcare_wellness;

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS wellness_services;
DROP TABLE IF EXISTS providers;
DROP TABLE IF EXISTS patients;

-- 1. patients table
CREATE TABLE patients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    address VARCHAR(255) NULL,
    dob DATE NULL,
    gender ENUM('Male', 'Female', 'Other') NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. providers table (includes admin)
CREATE TABLE providers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    specialization VARCHAR(100) NULL,
    phone VARCHAR(20) NULL,
    role ENUM('ADMIN', 'DOCTOR', 'WELLNESS_PROVIDER') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. wellness_services table
CREATE TABLE wellness_services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    duration INT NULL COMMENT 'Duration in days/weeks',
    fee DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. appointments table
CREATE TABLE appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    provider_id INT NOT NULL,
    appointment_date DATETIME NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    notes TEXT NULL,
    diagnosis TEXT NULL,
    prescription TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE
);

-- 5. enrollments table
CREATE TABLE enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    service_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    progress INT DEFAULT 0 COMMENT 'Percentage completed (0-100)',
    status ENUM('ACTIVE', 'COMPLETED', 'CANCELLED', 'ON_HOLD') DEFAULT 'ACTIVE',
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES wellness_services(id) ON DELETE CASCADE
);

-- 6. payments table
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    appointment_id INT UNIQUE NULL,
    service_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('PENDING', 'SUCCESS', 'FAILED') DEFAULT 'PENDING',
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    transaction_id VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES wellness_services(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_providers_email ON providers(email);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_provider_id ON appointments(provider_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_enrollments_patient_id ON enrollments(patient_id);
CREATE INDEX idx_enrollments_service_id ON enrollments(service_id);
CREATE INDEX idx_payments_patient_id ON payments(patient_id);
CREATE INDEX idx_payments_appointment_id ON payments(appointment_id);
CREATE INDEX idx_payments_service_id ON payments(service_id);

-- Insert sample data for testing

-- Sample patients
INSERT INTO patients (name, email, password, phone, address, dob, gender) VALUES
('John Doe', 'john.doe@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '1234567890', '123 Main St, City', '1990-01-15', 'Male'),
('Jane Smith', 'jane.smith@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0987654321', '456 Oak Ave, Town', '1985-05-20', 'Female'),
('Mike Johnson', 'mike.johnson@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '5551234567', '789 Pine Rd, Village', '1992-08-10', 'Male');

-- Sample providers (including admin)
INSERT INTO providers (name, email, password, specialization, phone, role) VALUES
('Mahesh G', 'maheshgolla14245@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', '9998887777', 'ADMIN'),
('Dr. Sarah Wilson', 'dr.sarah@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Cardiology', '1112223333', 'DOCTOR'),
('Dr. Robert Brown', 'dr.robert@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dermatology', '4445556666', 'DOCTOR'),
('Wellness Coach Lisa', 'lisa@wellness.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nutrition & Fitness', '7778889999', 'WELLNESS_PROVIDER');

-- Sample wellness services
INSERT INTO wellness_services (name, description, duration, fee, category) VALUES
('Yoga Classes', 'Weekly yoga sessions for stress relief and flexibility', 4, 50.00, 'FITNESS'),
('Nutrition Consultation', 'Personalized nutrition planning and guidance', 1, 75.00, 'NUTRITION'),
('Meditation Sessions', 'Guided meditation for mental wellness', 8, 30.00, 'MENTAL_HEALTH'),
('Fitness Training', 'Personal fitness training sessions', 12, 60.00, 'FITNESS'),
('Health Screening', 'Comprehensive health assessment', 1, 120.00, 'PREVENTIVE');

-- Sample appointments
INSERT INTO appointments (patient_id, provider_id, appointment_date, status, notes) VALUES
(1, 2, '2024-01-15 10:00:00', 'CONFIRMED', 'Regular checkup'),
(2, 3, '2024-01-16 14:30:00', 'PENDING', 'Skin consultation'),
(3, 4, '2024-01-17 09:00:00', 'SCHEDULED', 'Wellness assessment');

-- Sample enrollments
INSERT INTO enrollments (patient_id, service_id, start_date, end_date, progress, status) VALUES
(1, 1, '2024-01-01', '2024-01-29', 75, 'ACTIVE'),
(2, 2, '2024-01-05', '2024-01-05', 100, 'COMPLETED'),
(3, 3, '2024-01-10', '2024-02-28', 25, 'ACTIVE');

-- Sample payments
INSERT INTO payments (patient_id, appointment_id, service_id, amount, payment_status, transaction_id) VALUES
(1, 1, 5, 120.00, 'SUCCESS', 'TXN001'),
(2, 2, 2, 75.00, 'PENDING', 'TXN002'),
(3, 3, 1, 50.00, 'SUCCESS', 'TXN003');

-- Display table information
SELECT 'Database schema created successfully!' as message;
SELECT COUNT(*) as patients_count FROM patients;
SELECT COUNT(*) as providers_count FROM providers;
SELECT COUNT(*) as services_count FROM wellness_services;
SELECT COUNT(*) as appointments_count FROM appointments;
SELECT COUNT(*) as enrollments_count FROM enrollments;
SELECT COUNT(*) as payments_count FROM payments;

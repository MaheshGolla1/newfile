# 🗄️ Database Setup Guide

## 📋 **Database Schema Overview**

The Healthcare & Wellness Management System uses MySQL database with the following structure:

### **Tables:**
1. **patients** - Patient information and authentication
2. **providers** - Healthcare providers (doctors and wellness coaches)
3. **wellness_services** - Available wellness services
4. **appointments** - Patient appointments with providers
5. **enrollments** - Patient enrollments in wellness services
6. **payments** - Payment records for appointments and services

## 🚀 **Quick Setup**

### **Step 1: Install MySQL**
```bash
# Download MySQL Community Server
# https://dev.mysql.com/downloads/mysql/
```

### **Step 2: Create Database**
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE healthcare_wellness;
USE healthcare_wellness;
```

### **Step 3: Run Schema Script**
```bash
# Execute the database schema
mysql -u root -p healthcare_wellness < database_schema.sql
```

## 📊 **Table Structures**

### **1. patients**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique patient identifier |
| name | VARCHAR(100) | NOT NULL | Patient's full name |
| email | VARCHAR(100) | UNIQUE, NOT NULL | Patient's email address |
| password | VARCHAR(255) | NOT NULL | Encrypted password |
| phone | VARCHAR(20) | NULL | Contact phone number |
| address | VARCHAR(255) | NULL | Patient's address |
| dob | DATE | NULL | Date of birth |
| gender | ENUM | NULL | Gender (Male/Female/Other) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record update time |

### **2. providers**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique provider identifier |
| name | VARCHAR(100) | NOT NULL | Provider's full name |
| email | VARCHAR(100) | UNIQUE, NOT NULL | Provider's email address |
| password | VARCHAR(255) | NOT NULL | Encrypted password |
| specialization | VARCHAR(100) | NULL | Medical specialization |
| phone | VARCHAR(20) | NULL | Contact phone number |
| role | ENUM | NOT NULL | Role (DOCTOR/WELLNESS_PROVIDER) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record update time |

### **3. wellness_services**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique service identifier |
| name | VARCHAR(100) | NOT NULL | Service name |
| description | TEXT | NULL | Service description |
| duration | INT | NULL | Duration in days/weeks |
| fee | DECIMAL(10,2) | NOT NULL | Service fee |
| category | VARCHAR(50) | NULL | Service category |
| is_active | BOOLEAN | DEFAULT TRUE | Service availability |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record update time |

### **4. appointments**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique appointment identifier |
| patient_id | INT | FOREIGN KEY, NOT NULL | Reference to patients table |
| provider_id | INT | FOREIGN KEY, NOT NULL | Reference to providers table |
| appointment_date | DATETIME | NOT NULL | Appointment date and time |
| status | ENUM | DEFAULT 'PENDING' | Appointment status |
| notes | TEXT | NULL | Appointment notes |
| diagnosis | TEXT | NULL | Medical diagnosis |
| prescription | TEXT | NULL | Medical prescription |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record update time |

### **5. enrollments**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique enrollment identifier |
| patient_id | INT | FOREIGN KEY, NOT NULL | Reference to patients table |
| service_id | INT | FOREIGN KEY, NOT NULL | Reference to wellness_services table |
| start_date | DATE | NOT NULL | Enrollment start date |
| end_date | DATE | NOT NULL | Enrollment end date |
| progress | INT | DEFAULT 0 | Progress percentage (0-100) |
| status | ENUM | DEFAULT 'ACTIVE' | Enrollment status |
| notes | TEXT | NULL | Enrollment notes |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record update time |

### **6. payments**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique payment identifier |
| patient_id | INT | FOREIGN KEY, NOT NULL | Reference to patients table |
| appointment_id | INT | FOREIGN KEY, UNIQUE | Reference to appointments table |
| service_id | INT | FOREIGN KEY, NOT NULL | Reference to wellness_services table |
| amount | DECIMAL(10,2) | NOT NULL | Payment amount |
| payment_status | ENUM | DEFAULT 'PENDING' | Payment status |
| payment_date | DATETIME | DEFAULT CURRENT_TIMESTAMP | Payment date |
| transaction_id | VARCHAR(100) | NULL | External transaction ID |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record update time |

## 🔗 **Relationships**

### **Primary Key - Foreign Key Relationships:**

1. **patients → appointments** (1:N)
   - `appointments.patient_id → patients.id`

2. **providers → appointments** (1:N)
   - `appointments.provider_id → providers.id`

3. **patients → enrollments** (1:N)
   - `enrollments.patient_id → patients.id`

4. **wellness_services → enrollments** (1:N)
   - `enrollments.service_id → wellness_services.id`

5. **appointments → payments** (1:1)
   - `payments.appointment_id → appointments.id`

6. **wellness_services → payments** (1:N)
   - `payments.service_id → wellness_services.id`

7. **patients → payments** (1:N)
   - `payments.patient_id → patients.id`

## 📈 **Indexes**

For optimal performance, the following indexes are created:

```sql
-- Email indexes for quick lookups
CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_providers_email ON providers(email);

-- Appointment indexes
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_provider_id ON appointments(provider_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);

-- Enrollment indexes
CREATE INDEX idx_enrollments_patient_id ON enrollments(patient_id);
CREATE INDEX idx_enrollments_service_id ON enrollments(service_id);

-- Payment indexes
CREATE INDEX idx_payments_patient_id ON payments(patient_id);
CREATE INDEX idx_payments_appointment_id ON payments(appointment_id);
CREATE INDEX idx_payments_service_id ON payments(service_id);
```

## 🧪 **Sample Data**

The schema includes sample data for testing:

### **Sample Patients:**
- John Doe (john.doe@example.com)
- Jane Smith (jane.smith@example.com)
- Mike Johnson (mike.johnson@example.com)

### **Sample Providers:**
- Dr. Sarah Wilson (Cardiology)
- Dr. Robert Brown (Dermatology)
- Wellness Coach Lisa (Nutrition & Fitness)

### **Sample Services:**
- Yoga Classes ($50.00)
- Nutrition Consultation ($75.00)
- Meditation Sessions ($30.00)
- Fitness Training ($60.00)
- Health Screening ($120.00)

## 🔧 **Configuration**

### **Application Properties:**
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/healthcare_wellness?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

## 🚀 **Verification**

After setup, verify the database:

```sql
-- Check tables
SHOW TABLES;

-- Check sample data
SELECT COUNT(*) as patients_count FROM patients;
SELECT COUNT(*) as providers_count FROM providers;
SELECT COUNT(*) as services_count FROM wellness_services;
SELECT COUNT(*) as appointments_count FROM appointments;
SELECT COUNT(*) as enrollments_count FROM enrollments;
SELECT COUNT(*) as payments_count FROM payments;

-- Test relationships
SELECT p.name, a.appointment_date, pr.name as provider_name
FROM patients p
JOIN appointments a ON p.id = a.patient_id
JOIN providers pr ON a.provider_id = pr.id
LIMIT 5;
```

## 🛠️ **Troubleshooting**

### **Common Issues:**

1. **Connection Refused:**
   - Ensure MySQL service is running
   - Check port 3306 is not blocked

2. **Access Denied:**
   - Verify username and password
   - Check user privileges

3. **Table Not Found:**
   - Run the schema script again
   - Check database name

4. **Foreign Key Constraint:**
   - Ensure parent records exist
   - Check data integrity

---

**Your database is now ready for the Healthcare & Wellness Management System!** 🏥✨

# Healthcare & Wellness Management System - Backend

A comprehensive Spring Boot backend for managing healthcare services, appointments, and wellness programs with JWT authentication and role-based access control.

## 🚀 Features

### Core Features
- **JWT Authentication & Authorization** - Secure token-based authentication
- **Role-Based Access Control** - Patient, Doctor, and Admin roles
- **User Management** - Complete CRUD operations for users
- **Appointment Management** - Schedule, update, and manage appointments
- **Payment Processing** - Integrated payment system with multiple payment methods
- **Wellness Services** - Manage wellness programs and health tracking
- **RESTful APIs** - Comprehensive API endpoints for all operations
- **Swagger Documentation** - Interactive API documentation

### Security Features
- **BCrypt Password Hashing** - Secure password storage
- **JWT Token Management** - Stateless authentication
- **CORS Configuration** - Cross-origin resource sharing
- **Input Validation** - Comprehensive request validation
- **Role-Based Authorization** - Method-level security

### Database Features
- **MySQL Integration** - Relational database support
- **JPA/Hibernate** - Object-relational mapping
- **Data Validation** - Entity-level validation constraints
- **Audit Fields** - Automatic timestamp management

## 🛠️ Tech Stack

- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA / Hibernate
- **Security**: Spring Security + JWT
- **Documentation**: Swagger/OpenAPI 3
- **Build Tool**: Maven
- **Validation**: Bean Validation API

## 📋 Prerequisites

- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher
- IDE (IntelliJ IDEA, Eclipse, or VS Code)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Backend
```

### 2. Database Setup
1. Create a MySQL database:
```sql
CREATE DATABASE healthcare_db;
```

2. Update database configuration in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/healthcare_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. Build and Run
```bash
# Clean and build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### 4. Access Swagger Documentation
Open your browser and navigate to:
```
http://localhost:8080/api/swagger-ui.html
```

## 📚 API Documentation

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "role": "PATIENT"
}
```

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "PATIENT",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "MALE",
  "address": "123 Main St, City, State"
}
```

### User Management Endpoints

#### Get All Users (Admin Only)
```http
GET /api/users
Authorization: Bearer <jwt_token>
```

#### Get User by ID
```http
GET /api/users/{id}
Authorization: Bearer <jwt_token>
```

#### Update User
```http
PUT /api/users/{id}
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "phoneNumber": "+1234567890"
}
```

### Appointment Management Endpoints

#### Create Appointment
```http
POST /api/appointments
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "patient": {"id": 1},
  "doctor": {"id": 2},
  "appointmentDate": "2024-01-15",
  "appointmentTime": "10:00:00",
  "notes": "Regular checkup"
}
```

#### Get Appointments by Patient
```http
GET /api/appointments/patient/{patientId}
Authorization: Bearer <jwt_token>
```

#### Update Appointment Status
```http
PUT /api/appointments/{id}/status?status=COMPLETED
Authorization: Bearer <jwt_token>
```

### Payment Management Endpoints

#### Process Payment
```http
POST /api/payments/process
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "appointmentId": 1,
  "amount": 100.00,
  "paymentMethod": "CREDIT_CARD",
  "cardLastFour": "1234",
  "cardType": "VISA",
  "billingAddress": "123 Main St, City, State"
}
```

#### Get Payment History
```http
GET /api/payments/patient/{patientId}
Authorization: Bearer <jwt_token>
```

### Wellness Services Endpoints

#### Get All Wellness Services
```http
GET /api/wellness-services
```

#### Get Services by Category
```http
GET /api/wellness-services/category/FITNESS
```

#### Create Wellness Service (Admin Only)
```http
POST /api/wellness-services
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Yoga Classes",
  "description": "Relaxing yoga sessions",
  "category": "FITNESS",
  "durationMinutes": 60,
  "price": 25.00,
  "maxParticipants": 20
}
```

## 🔐 Security

### JWT Token Structure
```json
{
  "sub": "user@example.com",
  "role": "PATIENT",
  "iat": 1640995200,
  "exp": 1641081600
}
```

### Role-Based Access
- **PATIENT**: Can view own appointments, make payments, access wellness services
- **DOCTOR**: Can view patient appointments, update appointment status, manage wellness services
- **ADMIN**: Full access to all endpoints and system management

### Authentication Flow
1. User sends login/register request
2. Server validates credentials
3. Server generates JWT token with user role
4. Client includes JWT token in subsequent requests
5. Server validates token and checks role-based permissions

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('PATIENT', 'DOCTOR', 'ADMIN') NOT NULL,
    phone_number VARCHAR(20),
    profile_image VARCHAR(255),
    date_of_birth VARCHAR(10),
    gender ENUM('MALE', 'FEMALE', 'OTHER'),
    address TEXT,
    specialization TEXT,
    license_number VARCHAR(50),
    years_of_experience INT,
    consultation_fee DOUBLE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
```

### Appointments Table
```sql
CREATE TABLE appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW') DEFAULT 'SCHEDULED',
    payment_status ENUM('PENDING', 'PAID', 'REFUNDED', 'CANCELLED') DEFAULT 'PENDING',
    notes TEXT,
    consultation_fee DOUBLE,
    appointment_duration INT DEFAULT 30,
    cancellation_reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (doctor_id) REFERENCES users(id)
);
```

### Payments Table
```sql
CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    appointment_id BIGINT NOT NULL,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'CASH', 'INSURANCE') NOT NULL,
    status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED') DEFAULT 'PENDING',
    transaction_id VARCHAR(255) UNIQUE,
    card_last_four VARCHAR(4),
    card_type VARCHAR(20),
    billing_address TEXT,
    failure_reason VARCHAR(255),
    refund_amount DECIMAL(10,2),
    refund_reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id),
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (doctor_id) REFERENCES users(id)
);
```

### Wellness Services Table
```sql
CREATE TABLE wellness_services (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('FITNESS', 'NUTRITION', 'MENTAL_HEALTH', 'PREVENTIVE_CARE', 'REHABILITATION', 'WEIGHT_MANAGEMENT', 'STRESS_MANAGEMENT', 'SLEEP_THERAPY', 'YOGA', 'MEDITATION') NOT NULL,
    duration_minutes INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    max_participants INT,
    current_participants INT DEFAULT 0,
    service_image VARCHAR(255),
    requirements TEXT,
    benefits TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🧪 Testing

### Unit Tests
```bash
# Run unit tests
mvn test

# Run specific test class
mvn test -Dtest=AuthServiceTest

# Generate test coverage report
mvn jacoco:report
```

### Integration Tests
```bash
# Run integration tests
mvn test -Dtest=*IntegrationTest

# Run with specific profile
mvn test -Dspring.profiles.active=test
```

### API Testing
Use the Swagger UI or tools like Postman to test the APIs:

1. **Swagger UI**: `http://localhost:8080/api/swagger-ui.html`
2. **Postman Collection**: Import the provided Postman collection
3. **cURL Examples**: See the API documentation section above

## 🚀 Deployment

### Local Development
```bash
# Run with development profile
mvn spring-boot:run -Dspring.profiles.active=dev

# Run with custom port
mvn spring-boot:run -Dserver.port=8081
```

### Production Deployment

#### 1. Build JAR File
```bash
mvn clean package -DskipTests
```

#### 2. Run JAR File
```bash
java -jar target/healthcare-backend-1.0.0.jar
```

#### 3. Docker Deployment
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/healthcare-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

```bash
# Build Docker image
docker build -t healthcare-backend .

# Run Docker container
docker run -p 8080:8080 healthcare-backend
```

#### 4. Environment Variables
```bash
export SPRING_DATASOURCE_URL=jdbc:mysql://your-db-host:3306/healthcare_db
export SPRING_DATASOURCE_USERNAME=your_username
export SPRING_DATASOURCE_PASSWORD=your_password
export JWT_SECRET=your-secret-key-here
export JWT_EXPIRATION=86400000
```

## 📊 Monitoring and Logging

### Application Logs
```bash
# View application logs
tail -f logs/healthcare-backend.log

# Log levels configuration
logging.level.com.doctorpat=DEBUG
logging.level.org.springframework.security=DEBUG
```

### Health Check
```http
GET /api/actuator/health
```

### Metrics
```http
GET /api/actuator/metrics
```

## 🔧 Configuration

### Application Properties
Key configuration options in `application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/healthcare_db
spring.datasource.username=root
spring.datasource.password=password

# JWT Configuration
jwt.secret=your-secret-key-here
jwt.expiration=86400000

# Server Configuration
server.port=8080
server.servlet.context-path=/api

# Swagger Configuration
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.api-docs.path=/api-docs

# CORS Configuration
spring.web.cors.allowed-origins=http://localhost:3000
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation and FAQ

## 🔮 Future Enhancements

- **Telemedicine Integration** - Video consultation capabilities
- **Real Payment Gateway** - Stripe, PayPal integration
- **AI-Driven Recommendations** - Machine learning for health insights
- **Health Tracking** - Wearable device integration
- **Mobile App** - React Native mobile application
- **Email Notifications** - Automated appointment reminders
- **File Upload** - Medical document management
- **Analytics Dashboard** - Advanced reporting and analytics

---

**Note**: This is a development version. For production use, ensure proper security configurations, SSL certificates, and database backups are in place.

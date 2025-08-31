# 🏥 Healthcare & Wellness Management System

A comprehensive healthcare management system built with Spring Boot and React, featuring role-based access control, appointment scheduling, and wellness service management.

## 🚀 Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with secure token management
- **Role-based access control** (Patient, Doctor, Wellness Provider, Admin)
- **BCrypt password hashing** for security
- **CORS configuration** for cross-origin requests

### 👥 User Management
- **Patient Registration & Management** - Personal health records and appointment booking
- **Provider Management** - Doctors and wellness coaches with specializations
- **Admin Dashboard** - System administration and user management

### 📅 Appointment System
- **Appointment Scheduling** - Book appointments with healthcare providers
- **Status Management** - Track appointment status (Pending, Confirmed, Completed, Cancelled)
- **Provider Availability** - Manage provider schedules

### 💊 Wellness Services
- **Service Catalog** - Browse available wellness services
- **Service Categories** - Organized by type (Fitness, Nutrition, Mental Health, etc.)
- **Pricing Management** - Transparent fee structure

### 💳 Payment System
- **Payment Processing** - Track payments for appointments and services
- **Transaction Management** - Secure payment records
- **Payment Status Tracking** - Monitor payment status

### 📊 Admin Features
- **System Statistics** - Dashboard with key metrics
- **User Management** - Manage all users and their roles
- **Service Management** - Add/edit wellness services
- **Report Generation** - System reports and analytics

## 🛠️ Technology Stack

### Backend
- **Spring Boot 3.2.0** - Main framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database operations
- **MySQL 8.0** - Database
- **JWT** - Token-based authentication
- **Lombok** - Code generation
- **Swagger/OpenAPI** - API documentation

### Frontend
- **React 18.2.0** - User interface
- **React Bootstrap** - UI components
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Icons** - Icon library

## 📋 Prerequisites

- **Java 17** or higher
- **Maven 3.6+**
- **MySQL 8.0+**
- **Node.js 16+** and **npm**

## 🚀 Quick Start

### 1. Database Setup

```bash
# Create database
mysql -u root -p
CREATE DATABASE healthcare_wellness;
USE healthcare_wellness;

# Run schema script
mysql -u root -p healthcare_wellness < database_schema.sql
```

### 2. Backend Setup

```bash
# Navigate to project directory
cd healthcare-wellness-system

# Update database configuration in application.properties
# Set your MySQL username and password

# Build and run
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will start on `http://localhost:3000`

## 🔑 Default Admin Account

- **Email:** maheshgolla14245@gmail.com
- **Password:** admin123
- **Role:** ADMIN

## 📚 API Documentation

Once the backend is running, access the Swagger UI at:
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **API Docs:** http://localhost:8080/v3/api-docs

## 🏗️ Project Structure

```
healthcare-wellness-system/
├── src/main/java/com/healthcare/wellness/
│   ├── config/          # Configuration classes
│   ├── controller/      # REST controllers
│   ├── dto/            # Data Transfer Objects
│   ├── entity/         # JPA entities
│   ├── repository/     # Data access layer
│   ├── service/        # Business logic
│   └── WellnessManagementApplication.java
├── src/main/resources/
│   ├── application.properties
│   └── database_schema.sql
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── contexts/    # React contexts
│   │   ├── services/    # API services
│   │   └── index.css
│   ├── package.json
│   └── README.md
└── README.md
```

## 🔧 Configuration

### Database Configuration
Update `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/healthcare_wellness
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### JWT Configuration
```properties
jwt.secret=your_jwt_secret_key
jwt.expiration=86400000
```

## 🧪 Testing

### Backend Testing
```bash
# Run unit tests
mvn test

# Run integration tests
mvn verify
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
```bash
# Build JAR file
mvn clean package

# Run JAR file
java -jar target/wellness-management-0.0.1-SNAPSHOT.jar
```

### Frontend Deployment
```bash
cd frontend
npm run build
```

## 📱 User Roles

### 1. **Patient**
- Register and manage profile
- Book appointments with providers
- View appointment history
- Enroll in wellness services
- Make payments

### 2. **Doctor**
- Manage patient appointments
- Update appointment status
- View patient information
- Manage medical records

### 3. **Wellness Provider**
- Manage wellness appointments
- Track service enrollments
- Update patient progress
- Manage service offerings

### 4. **Admin**
- System administration
- User management
- Service management
- System statistics
- Payment management

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-based Authorization** - Fine-grained access control
- **Password Hashing** - BCrypt encryption
- **CORS Protection** - Cross-origin request security
- **Input Validation** - Data validation and sanitization

## 📊 Database Schema

The system uses 6 main tables:
- **patients** - Patient information
- **providers** - Healthcare providers
- **wellness_services** - Available services
- **appointments** - Appointment records
- **enrollments** - Service enrollments
- **payments** - Payment records

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API docs at `/swagger-ui.html`

## 🎯 Roadmap

- [ ] Telemedicine integration
- [ ] Real payment gateway
- [ ] AI-driven recommendations
- [ ] Mobile app (React Native)
- [ ] Health tracking dashboard
- [ ] Advanced reporting
- [ ] Multi-language support

---

**Built with ❤️ for better healthcare management**

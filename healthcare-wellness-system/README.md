# Healthcare & Wellness Management System

A comprehensive healthcare and wellness management system built with Spring Boot backend and React frontend, designed to facilitate appointment booking, service management, and user administration for healthcare providers and patients.

## 🏥 Features

### For Patients
- **User Registration & Authentication**: Secure signup and login with role-based access
- **Service Discovery**: Browse and search healthcare services by category
- **Appointment Booking**: Schedule appointments with healthcare providers
- **Appointment Management**: View, reschedule, and cancel appointments
- **Profile Management**: Update personal and medical information
- **Service Reviews**: Rate and review healthcare services

### For Healthcare Providers
- **Service Management**: Create, edit, and manage offered services
- **Appointment Dashboard**: View and manage patient appointments
- **Schedule Management**: Set availability and manage time slots
- **Patient Records**: Access patient information and medical history
- **Service Analytics**: Track service performance and patient feedback

### For Administrators
- **User Management**: Manage all users (patients, providers, admins)
- **System Overview**: Dashboard with key metrics and statistics
- **Service Administration**: Oversee all healthcare services
- **Appointment Monitoring**: Track all appointments across the system
- **System Configuration**: Manage system settings and configurations

## 🛠️ Technology Stack

### Backend
- **Spring Boot 3.x**: Main application framework
- **Spring Security**: Authentication and authorization
- **Spring Data JPA**: Database operations
- **JWT**: Token-based authentication
- **H2 Database**: In-memory database for development
- **Maven**: Dependency management

### Frontend
- **React 18**: User interface framework
- **React Router**: Client-side routing
- **React Bootstrap**: UI components
- **Axios**: HTTP client for API calls
- **React Toastify**: Notification system
- **Font Awesome**: Icons

## 📁 Project Structure

```
healthcare-wellness-system/
├── frontend/                 # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   ├── services/        # API services
│   │   └── index.js
│   └── package.json
├── src/main/java/com/healthcare/wellness/
│   ├── config/              # Configuration classes
│   ├── controller/          # REST controllers
│   ├── dto/                 # Data transfer objects
│   ├── entity/              # JPA entities
│   ├── repository/          # Data access layer
│   ├── service/             # Business logic
│   └── WellnessManagementApplication.java
├── src/main/resources/
│   └── application.properties
└── pom.xml
```

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- Maven 3.6 or higher
- MySQL 8.0 or higher

### Database Setup

1. **Create MySQL Database**
   ```sql
   CREATE DATABASE healthcare_wellness;
   ```

2. **Update Database Configuration**
   Edit `src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd healthcare-wellness-system
   ```

2. **Run the Spring Boot application**
   ```bash
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

   The frontend will start on `http://localhost:3000`

## 🔐 Authentication & Authorization

The system uses JWT (JSON Web Tokens) for authentication with role-based access control:

- **PATIENT**: Can book appointments, view services, manage profile, enroll in wellness programs
- **PROVIDER**: Can manage services, view appointments, access patient data, update appointment status
- **ADMIN**: Full system access and user management

### Security Features
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Granular permissions based on user roles
- **Password Hashing**: BCrypt encryption for secure password storage
- **CORS Configuration**: Cross-origin resource sharing setup
- **Input Validation**: Comprehensive request validation and sanitization

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register Patient/Provider
- `POST /api/auth/login` - Login & get JWT

### Patients
- `GET /api/patients/{id}` - Get patient details
- `PUT /api/patients/{id}` - Update profile
- `GET /api/patients/profile` - Get current patient profile
- `PUT /api/patients/profile` - Update current patient profile

### Providers
- `GET /api/providers/{id}` - Get provider details
- `PUT /api/providers/{id}` - Update provider profile
- `GET /api/providers/profile` - Get current provider profile
- `PUT /api/providers/profile` - Update current provider profile

### Appointments
- `POST /api/appointments` - Book appointment
- `GET /api/appointments/{patientId}` - View patient appointments
- `GET /api/appointments` - View all appointments (Admin)
- `PUT /api/appointments/{id}` - Update appointment
- `DELETE /api/appointments/{id}` - Delete appointment
- `GET /api/appointments/available-slots` - Get available time slots

### Wellness Services
- `GET /api/services` - Get all wellness services
- `POST /api/services` - Create new service
- `PUT /api/services/{id}` - Update service
- `DELETE /api/services/{id}` - Delete service
- `GET /api/services/search` - Search services

### Enrollments
- `POST /api/enrollments` - Enroll patient in service
- `GET /api/enrollments/patient/{patientId}` - Get patient enrollments
- `GET /api/enrollments/{id}` - Get enrollment details
- `PUT /api/enrollments/{id}/progress` - Update enrollment progress
- `DELETE /api/enrollments/{id}` - Cancel enrollment

### Payments
- `POST /api/payments` - Process payment
- `GET /api/payments/patient/{patientId}` - Get patient payments
- `GET /api/payments/{id}` - Get payment details
- `PUT /api/payments/{id}/status` - Update payment status
- `GET /api/payments/appointment/{appointmentId}` - Get payment by appointment

### Users (Admin)
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update current user profile
- `PUT /api/users/{id}` - Update user (Admin only)

## 🗄️ Database Schema

### Core Entities
- **User**: System users (patients, providers, admins)
- **Patient**: Patient-specific information
- **Provider**: Healthcare provider information
- **WellnessService**: Available healthcare services
- **Appointment**: Patient-provider appointments
- **Enrollment**: Service enrollment records
- **Payment**: Payment transactions

### Key Relationships
- User has one Patient/Provider profile
- Provider offers multiple WellnessServices
- Patient books multiple Appointments
- Appointment links Patient, Provider, and Service

## 🎨 UI Components

### Dashboard Components
- **PatientDashboard**: Patient overview and quick actions
- **ProviderDashboard**: Provider schedule and service management
- **AdminDashboard**: System administration and analytics

### Feature Components
- **Appointments**: Appointment booking and management
- **Services**: Service discovery and details
- **Profile**: User profile and settings management

## 🔧 Configuration

### Backend Configuration
Key configuration in `application.properties`:
```properties
# Database
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver

# JWT
jwt.secret=your-secret-key
jwt.expiration=86400000

# Server
server.port=8080
```

### Frontend Configuration
- API base URL: `http://localhost:8080`
- Proxy configuration in `package.json`

## 🧪 Testing

### Backend Testing
```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=AuthControllerTest

# Run with coverage
mvn test jacoco:report
```

### Frontend Testing
```bash
cd frontend
npm test
npm run test:coverage
```

### Testing Strategy
- **Unit Testing**: JUnit & Mockito for service/repository layers
- **Integration Testing**: Spring Boot Test for API endpoints
- **Frontend Testing**: React Testing Library / Jest
- **API Testing**: Swagger UI interactive testing
- **Performance Testing**: JMeter for load testing

## 📝 API Documentation

The API documentation is available at:
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- API Docs: `http://localhost:8080/v3/api-docs`

### Swagger UI Features
- **API Documentation Home**: Displays API title, version, and description
- **Endpoint Grouping**: APIs grouped by tags (Authentication, Patients, Appointments, Wellness Services, Payments)
- **Search Functionality**: Quick search for any endpoint
- **Interactive Testing**: Test endpoints directly from the UI
- **Security**: JWT Bearer token authentication support

## 🚀 Deployment

### Quick Start
```bash
# Backend
mvn clean package
java -jar target/wellness-management-0.0.1-SNAPSHOT.jar

# Frontend
cd frontend
npm run build
```

### Deployment Options
- **Backend**: Spring Boot JAR, Tomcat, Docker
- **Frontend**: Netlify, AWS S3 + CloudFront, Nginx
- **Database**: MySQL (local/RDS), PostgreSQL

### Production Deployment
For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

### CI/CD Pipeline
- **GitHub Actions**: Automated build, test, and deployment
- **Docker**: Containerized deployment
- **Monitoring**: Health checks and performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- **Telemedicine Integration**: Video consultation features
- **Payment Processing**: Integrated payment gateway
- **Mobile App**: Native mobile applications
- **AI Recommendations**: Smart service recommendations
- **Analytics Dashboard**: Advanced reporting and analytics
- **Multi-language Support**: Internationalization
- **Notification System**: Email and SMS notifications
- **Health Records**: Comprehensive patient health records

---

**Note**: This is a development version. For production use, ensure proper security configurations, database setup, and environment-specific configurations.

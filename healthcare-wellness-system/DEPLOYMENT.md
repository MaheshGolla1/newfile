# Healthcare & Wellness Management System - Deployment Guide

## 🚀 Deployment Overview

This guide covers deployment of the Healthcare & Wellness Management System across different environments and platforms.

## 📋 Prerequisites

### System Requirements
- **Java 17** or higher
- **Node.js 16** or higher
- **MySQL 8.0** or higher
- **Maven 3.6** or higher
- **Git**

### Production Requirements
- **Server**: 2GB RAM minimum, 4GB recommended
- **Storage**: 20GB minimum
- **Network**: HTTPS support
- **Domain**: Custom domain for production

## 🏗️ Backend Deployment

### 1. Spring Boot JAR Deployment

#### Local Development
```bash
# Build the application
mvn clean package

# Run the JAR file
java -jar target/wellness-management-0.0.1-SNAPSHOT.jar
```

#### Production Deployment

##### Option A: Standalone JAR
```bash
# Build for production
mvn clean package -Pprod

# Run with production profile
java -jar target/wellness-management-0.0.1-SNAPSHOT.jar \
  --spring.profiles.active=prod \
  --server.port=8080
```

##### Option B: Tomcat Deployment
```bash
# Build WAR file
mvn clean package -Pwar

# Deploy to Tomcat
cp target/wellness-management-0.0.1-SNAPSHOT.war $TOMCAT_HOME/webapps/
```

##### Option C: Docker Deployment
```dockerfile
# Dockerfile
FROM openjdk:17-jdk-slim
COPY target/wellness-management-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

```bash
# Build and run Docker container
docker build -t healthcare-wellness .
docker run -p 8080:8080 healthcare-wellness
```

### 2. Database Deployment

#### MySQL Local Setup
```sql
-- Create database
CREATE DATABASE healthcare_wellness;

-- Create user
CREATE USER 'healthcare_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON healthcare_wellness.* TO 'healthcare_user'@'localhost';
FLUSH PRIVILEGES;
```

#### Production Database (AWS RDS)
```bash
# AWS RDS MySQL Configuration
Endpoint: healthcare-wellness.c123456789.us-east-1.rds.amazonaws.com
Port: 3306
Database: healthcare_wellness
Username: admin
Password: [secure_password]
```

#### Database Migration
```bash
# Run database migrations
mvn flyway:migrate

# Or use Spring Boot auto-migration
spring.jpa.hibernate.ddl-auto=update
```

### 3. Environment Configuration

#### Development Properties
```properties
# application-dev.properties
spring.datasource.url=jdbc:mysql://localhost:3306/healthcare_wellness
spring.datasource.username=root
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update
logging.level.com.healthcare.wellness=DEBUG
```

#### Production Properties
```properties
# application-prod.properties
spring.datasource.url=jdbc:mysql://healthcare-wellness.c123456789.us-east-1.rds.amazonaws.com:3306/healthcare_wellness
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=validate
logging.level.com.healthcare.wellness=INFO
server.port=8080
```

## 🎨 Frontend Deployment

### 1. React App Build

#### Development
```bash
cd frontend
npm install
npm start
```

#### Production Build
```bash
cd frontend
npm install
npm run build
```

### 2. Deployment Options

#### Option A: Netlify Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy to Netlify
cd frontend
netlify deploy --prod --dir=build
```

#### Option B: AWS S3 + CloudFront
```bash
# Upload to S3
aws s3 sync build/ s3://healthcare-wellness-frontend

# Configure CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name healthcare-wellness-frontend.s3.amazonaws.com
```

#### Option C: Nginx Server
```nginx
# nginx.conf
server {
    listen 80;
    server_name healthcare-wellness.com;
    root /var/www/healthcare-wellness;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Option D: Docker Frontend
```dockerfile
# Dockerfile
FROM nginx:alpine
COPY build/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

## 🔐 Security Configuration

### 1. SSL/HTTPS Setup

#### Let's Encrypt (Free)
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d healthcare-wellness.com
```

#### AWS Certificate Manager
```bash
# Request certificate
aws acm request-certificate \
  --domain-name healthcare-wellness.com \
  --validation-method DNS
```

### 2. Environment Variables
```bash
# Production environment variables
export DB_USERNAME=healthcare_user
export DB_PASSWORD=secure_password_123
export JWT_SECRET=your_super_secure_jwt_secret_key_2024
export JWT_EXPIRATION=86400000
```

### 3. Firewall Configuration
```bash
# UFW Firewall
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

## 📊 Monitoring & Logging

### 1. Application Monitoring

#### Spring Boot Actuator
```properties
# application.properties
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=always
```

#### Health Check Endpoints
```bash
# Health check
curl http://localhost:8080/api/actuator/health

# Application info
curl http://localhost:8080/api/actuator/info

# Metrics
curl http://localhost:8080/api/actuator/metrics
```

### 2. Logging Configuration
```properties
# application.properties
logging.file.name=logs/healthcare-wellness.log
logging.pattern.file=%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n
logging.level.com.healthcare.wellness=INFO
logging.level.org.springframework.security=WARN
```

### 3. AWS CloudWatch (Optional)
```xml
<!-- pom.xml -->
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-cloudwatch</artifactId>
</dependency>
```

## 🚀 CI/CD Pipeline

### 1. GitHub Actions

#### Backend Pipeline
```yaml
# .github/workflows/backend.yml
name: Backend CI/CD

on:
  push:
    branches: [ main ]
    paths: [ 'src/**', 'pom.xml' ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up JDK 17
      uses: actions/setup-java@v2
      with:
        java-version: '17'
        distribution: 'adopt'
    
    - name: Build with Maven
      run: mvn clean package
    
    - name: Run tests
      run: mvn test
    
    - name: Deploy to server
      run: |
        scp target/wellness-management-0.0.1-SNAPSHOT.jar user@server:/app/
        ssh user@server "sudo systemctl restart healthcare-wellness"
```

#### Frontend Pipeline
```yaml
# .github/workflows/frontend.yml
name: Frontend CI/CD

on:
  push:
    branches: [ main ]
    paths: [ 'frontend/**' ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
    
    - name: Install dependencies
      run: |
        cd frontend
        npm install
    
    - name: Build
      run: |
        cd frontend
        npm run build
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v1.2
      with:
        publish-dir: './frontend/build'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
```

## 📈 Performance Optimization

### 1. Database Optimization
```sql
-- Create indexes for better performance
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_provider_id ON appointments(provider_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_payments_patient_id ON payments(patient_id);
```

### 2. JVM Optimization
```bash
# Production JVM settings
java -Xms512m -Xmx2g \
  -XX:+UseG1GC \
  -XX:MaxGCPauseMillis=200 \
  -jar wellness-management-0.0.1-SNAPSHOT.jar
```

### 3. Frontend Optimization
```javascript
// React optimization
const App = React.lazy(() => import('./App'));
const PatientDashboard = React.lazy(() => import('./components/PatientDashboard'));

// Code splitting
<Suspense fallback={<Loading />}>
  <PatientDashboard />
</Suspense>
```

## 🔄 Backup & Recovery

### 1. Database Backup
```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u healthcare_user -p healthcare_wellness > backup_$DATE.sql
gzip backup_$DATE.sql
aws s3 cp backup_$DATE.sql.gz s3://healthcare-wellness-backups/
```

### 2. Application Backup
```bash
# Backup application files
tar -czf app_backup_$(date +%Y%m%d).tar.gz /opt/healthcare-wellness/
aws s3 cp app_backup_$(date +%Y%m%d).tar.gz s3://healthcare-wellness-backups/
```

## 🆘 Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Check database connectivity
mysql -h localhost -u healthcare_user -p healthcare_wellness

# Check application logs
tail -f logs/healthcare-wellness.log
```

#### 2. Memory Issues
```bash
# Check JVM memory usage
jstat -gc <pid>

# Increase heap size if needed
java -Xmx4g -jar wellness-management-0.0.1-SNAPSHOT.jar
```

#### 3. Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :8080

# Kill process if needed
sudo kill -9 <pid>
```

## 📞 Support & Maintenance

### 1. Monitoring Alerts
- Set up email alerts for application errors
- Monitor database performance
- Track API response times

### 2. Regular Maintenance
- Weekly database backups
- Monthly security updates
- Quarterly performance reviews

### 3. Contact Information
- **Technical Support**: tech@healthcare-wellness.com
- **Emergency**: +1-555-HEALTH-911
- **Documentation**: https://docs.healthcare-wellness.com

---

**Note**: This deployment guide should be customized based on your specific infrastructure and requirements. Always test deployments in a staging environment before applying to production.

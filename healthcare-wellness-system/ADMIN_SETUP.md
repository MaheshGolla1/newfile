# 👨‍💼 Admin Setup Guide

## 🔑 **Admin Login Details**

### **Default Admin Account:**
- **Name:** Mahesh G
- **Email:** maheshgolla14245@gmail.com
- **Password:** admin123
- **Role:** ADMIN

## 🚀 **How to Access Admin Dashboard**

1. **Start the application:**
   ```bash
   # Backend
   mvn spring-boot:run
   
   # Frontend
   cd frontend
   npm start
   ```

2. **Login as Admin:**
   - Go to `http://localhost:3000/login`
   - Enter the admin credentials:
     - Email: `maheshgolla14245@gmail.com`
     - Password: `admin123`

3. **Access Admin Dashboard:**
   - After successful login, you'll be automatically redirected to the Admin Dashboard
   - The system detects your role and routes you to the appropriate dashboard

## 👥 **User Roles Available**

### **Registration Options:**
When users register, they can choose from these roles:

1. **PATIENT** - Regular patients who can book appointments
2. **DOCTOR** - Medical doctors who provide healthcare services
3. **WELLNESS_PROVIDER** - Wellness coaches and therapists
4. **ADMIN** - System administrators with full access

### **Role-Based Access:**
- **Patients** → Patient Dashboard
- **Doctors** → Provider Dashboard
- **Wellness Providers** → Provider Dashboard
- **Admins** → Admin Dashboard

## 🎯 **Admin Dashboard Features**

### **Overview:**
- **Statistics Cards:** Total patients, providers, appointments, payments
- **Quick Actions:** Add new patients, providers, view reports, system settings
- **Recent Appointments:** List of recent appointments with status
- **System Information:** Database and application details

### **Admin Capabilities:**
- View all system statistics
- Monitor appointments and payments
- Access to all user data
- System configuration
- Reports and analytics

## 🔧 **Database Setup**

The admin user is automatically created when you run the database schema:

```sql
-- Admin user is created in database_schema.sql
INSERT INTO providers (name, email, password, specialization, phone, role) VALUES
('Mahesh G', 'maheshgolla14245@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', '9998887777', 'ADMIN');
```

## 🛡️ **Security Notes**

- The admin password is hashed using BCrypt
- Only one admin account is created by default
- Admin role has full system access
- JWT tokens are used for authentication

## 🎨 **UI Features**

### **Admin Dashboard Design:**
- **Green Theme:** Success-oriented color scheme
- **Responsive Design:** Works on all devices
- **Modern Cards:** Clean, professional layout
- **Interactive Elements:** Hover effects and animations
- **Status Badges:** Color-coded appointment statuses

### **Color Scheme:**
- **Primary Green:** #28a745 (Success actions)
- **Blue:** #007bff (Information)
- **Purple:** #6f42c1 (Statistics)
- **Orange:** #fd7e14 (Warnings)

## 🚀 **Quick Start Commands**

```bash
# 1. Set up database
mysql -u root -p healthcare_wellness < database_schema.sql

# 2. Start backend
mvn spring-boot:run

# 3. Start frontend
cd frontend
npm start

# 4. Login as admin
# URL: http://localhost:3000/login
# Email: maheshgolla14245@gmail.com
# Password: admin123
```

## 📱 **Testing Different Roles**

You can test different user roles by registering new accounts:

1. **Register as Patient:**
   - Role: PATIENT
   - Access: Patient Dashboard

2. **Register as Doctor:**
   - Role: DOCTOR
   - Specialization: Cardiology, Dermatology, etc.
   - Access: Provider Dashboard

3. **Register as Wellness Provider:**
   - Role: WELLNESS_PROVIDER
   - Specialization: Nutrition, Fitness, etc.
   - Access: Provider Dashboard

4. **Register as Admin:**
   - Role: ADMIN
   - Specialization: System Administrator
   - Access: Admin Dashboard

---

**Your Healthcare & Wellness Management System is now ready with full admin functionality!** 🏥✨

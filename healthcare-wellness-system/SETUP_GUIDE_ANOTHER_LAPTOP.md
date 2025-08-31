# 🚀 Complete Setup Guide for Another Laptop

## 📋 **Prerequisites Installation**

### **1.1 Install Required Software**

#### **Java Development Kit (JDK) 17+**
1. Download OpenJDK 17 or Oracle JDK 17
   - **OpenJDK**: https://adoptium.net/
   - **Oracle JDK**: https://www.oracle.com/java/technologies/downloads/
2. Install with default settings
3. Verify installation:
   ```bash
   java -version
   javac -version
   ```

#### **IntelliJ IDEA IDE**
1. Download IntelliJ IDEA Community Edition (Free)
   - **Download**: https://www.jetbrains.com/idea/download/
2. Install with default settings
3. Launch IntelliJ IDEA

#### **Node.js 16+**
1. Download Node.js LTS version
   - **Download**: https://nodejs.org/
2. Install with default settings
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

#### **MySQL 8.0+**
1. Download MySQL Community Server
   - **Download**: https://dev.mysql.com/downloads/mysql/
2. Install with default settings
3. Set root password during installation
4. Verify installation:
   ```bash
   mysql --version
   ```

#### **Git (Optional but Recommended)**
1. Download Git for your OS
   - **Download**: https://git-scm.com/downloads
2. Install with default settings
3. Verify installation:
   ```bash
   git --version
   ```

## 🎯 **Step 2: Clone Project from GitHub**

### **2.1 Using IntelliJ IDEA (Recommended)**

1. **Open IntelliJ IDEA**
2. **Click "Get from VCS"** (or "Check out from Version Control")
3. **Enter Repository URL**:
   ```
   https://github.com/MaheshGolla1/wiprogit-demo.git
   ```
4. **Choose Directory**: Select where to save the project
5. **Click "Clone"**
6. **Wait for download to complete**

### **2.2 Alternative: Using Git Command Line**
```bash
# Navigate to desired directory
cd C:\Users\YourUsername\Desktop

# Clone the repository
git clone https://github.com/MaheshGolla1/wiprogit-demo.git

# Navigate into project
cd wiprogit-demo
```

## 🗄️ **Step 3: Database Setup**

### **3.1 Start MySQL Service**
```bash
# Windows (if installed as service)
net start mysql

# Or start MySQL manually from Start Menu
```

### **3.2 Create Database**
1. **Open MySQL Command Line Client** or **MySQL Workbench**
2. **Login with root password**
3. **Create database**:
   ```sql
   CREATE DATABASE healthcare_wellness;
   ```
4. **Verify database creation**:
   ```sql
   SHOW DATABASES;
   ```

### **3.3 Configure Database Connection**
1. **Open `src/main/resources/application.properties`**
2. **Update database configuration**:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/healthcare_wellness
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   ```

## 🔧 **Step 4: IntelliJ IDEA Project Setup**

### **4.1 Open Project in IntelliJ**
1. **File → Open**
2. **Select the cloned project folder**
3. **Wait for IntelliJ to index the project**

### **4.2 Configure Maven**
1. **IntelliJ should automatically detect Maven project**
2. **If not, right-click `pom.xml` → "Add as Maven Project"**
3. **Wait for Maven to download dependencies**

### **4.3 Configure Java SDK**
1. **File → Project Structure**
2. **Project Settings → Project**
3. **Set Project SDK to Java 17**
4. **Set Project language level to 17**

### **4.4 Configure Run Configuration**
1. **Run → Edit Configurations**
2. **Click "+" → "Spring Boot"**
3. **Configure**:
   - **Name**: `Healthcare Wellness App`
   - **Main class**: `com.healthcare.wellness.WellnessManagementApplication`
   - **Module**: `healthcare-wellness-system`
4. **Click "Apply" and "OK"**

## 🚀 **Step 5: Backend Setup**

### **5.1 Build Project**
1. **Open Maven tool window** (View → Tool Windows → Maven)
2. **Expand Lifecycle**
3. **Double-click "clean"**
4. **Double-click "install"**

### **5.2 Run Backend Application**
1. **Find `WellnessManagementApplication.java`**
2. **Right-click → "Run 'WellnessManagementApplication'"**
3. **Or use Run Configuration created earlier**
4. **Wait for application to start**

### **5.3 Verify Backend**
1. **Open browser**
2. **Go to**: `http://localhost:8080`
3. **You should see**: "Healthcare & Wellness Management System is running!"
4. **API Documentation**: `http://localhost:8080/swagger-ui.html`

## 🎨 **Step 6: Frontend Setup**

### **6.1 Open Terminal in IntelliJ**
1. **View → Tool Windows → Terminal**
2. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

### **6.2 Install Dependencies**
```bash
npm install
```

### **6.3 Start Frontend Development Server**
```bash
npm start
```

### **6.4 Verify Frontend**
1. **Open browser**
2. **Go to**: `http://localhost:3000`
3. **You should see the Healthcare & Wellness application**

## 🔐 **Step 7: Initial Setup**

### **7.1 Create Admin User**
1. **Go to**: `http://localhost:3000/register`
2. **Register with role "ADMIN"**
3. **Login with created credentials**

### **7.2 Test System**
1. **Test user registration**
2. **Test login functionality**
3. **Test appointment booking**
4. **Test service management**

## 📱 **Step 8: Access Points**

### **Application URLs**
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:8080`
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **API Docs**: `http://localhost:8080/v3/api-docs`

## 🛠️ **Step 9: Development Workflow**

### **9.1 Running the Application**
1. **Start Backend**: Run `WellnessManagementApplication.java`
2. **Start Frontend**: `npm start` in frontend directory
3. **Access Application**: `http://localhost:3000`

### **9.2 Making Changes**
1. **Backend Changes**: IntelliJ will auto-reload
2. **Frontend Changes**: React will hot-reload
3. **Database Changes**: Restart backend application

### **9.3 Debugging**
1. **Set breakpoints in IntelliJ**
2. **Debug backend**: Right-click → "Debug"
3. **Debug frontend**: Use browser developer tools

## 🔧 **Step 10: Troubleshooting**

### **Common Issues & Solutions**

#### **Port Already in Use**
```bash
# Find process using port 8080
netstat -ano | findstr :8080

# Kill process
taskkill /PID <process_id> /F
```

#### **Database Connection Issues**
1. **Check MySQL service is running**
2. **Verify database credentials in `application.properties`**
3. **Ensure database `healthcare_wellness` exists**

#### **Node.js Issues**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install
```

#### **Maven Issues**
1. **Refresh Maven project**: Right-click project → Maven → Reload Project
2. **Clean and rebuild**: Maven → Lifecycle → clean → install

## 📚 **Step 11: Useful IntelliJ Shortcuts**

### **Essential Shortcuts**
- **Run**: `Shift + F10`
- **Debug**: `Shift + F9`
- **Navigate**: `Ctrl + N` (find class)
- **Search**: `Ctrl + Shift + F` (find in files)
- **Refactor**: `Ctrl + Alt + Shift + T`
- **Generate**: `Alt + Insert`

### **Maven Shortcuts**
- **Reload Project**: Right-click project → Maven → Reload Project
- **Clean**: Maven → Lifecycle → clean
- **Install**: Maven → Lifecycle → install

## 🎉 **Step 12: Success Verification**

### **Checklist**
- ✅ Java 17+ installed and configured
- ✅ IntelliJ IDEA opened project successfully
- ✅ Maven dependencies downloaded
- ✅ MySQL database created and connected
- ✅ Backend application running on port 8080
- ✅ Frontend application running on port 3000
- ✅ Swagger UI accessible
- ✅ User registration and login working
- ✅ All features functional

## 🚀 **Next Steps**

### **Development**
1. **Explore the codebase structure**
2. **Review API documentation in Swagger**
3. **Test all features**
4. **Make modifications as needed**

### **Production Deployment**
1. **Review `DEPLOYMENT.md` for production setup**
2. **Configure production database**
3. **Set up proper security measures**
4. **Deploy to production server**

---

**Your Healthcare & Wellness Management System is now ready for development on the new laptop!** 🏥✨

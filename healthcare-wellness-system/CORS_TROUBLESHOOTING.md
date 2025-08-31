# 🔧 CORS Troubleshooting Guide

## 🚨 **Current Issue**
You're getting a CORS error when trying to register a user from the frontend (localhost:3000) to the backend (localhost:8080).

## ✅ **Fixes Applied**

### **1. Updated SecurityConfig.java**
- Fixed deprecated Spring Security 6.x syntax
- Added proper CORS configuration
- Added Swagger UI endpoints to permitted URLs

### **2. Created CorsConfig.java**
- Added separate CORS configuration class
- Implemented WebMvcConfigurer for global CORS support
- Configured all necessary CORS headers

### **3. Fixed application.properties**
- Removed `server.servlet.context-path=/api` which was causing double `/api` prefix
- Now endpoints are accessible at `/api/auth/register` instead of `/api/api/auth/register`

### **4. Added Test Endpoint**
- Added `/api/auth/test` endpoint for CORS testing

## 🧪 **Testing Steps**

### **Step 1: Test Backend Health**
```bash
# Test if backend is running
curl http://localhost:8080/api/auth/health
```

### **Step 2: Test CORS Endpoint**
```bash
# Test CORS configuration
curl http://localhost:8080/api/auth/test
```

### **Step 3: Test from Browser Console**
Open browser console on `http://localhost:3000` and run:
```javascript
fetch('http://localhost:8080/api/auth/test', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.text())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### **Step 4: Test Registration Endpoint**
```javascript
fetch('http://localhost:8080/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    phone: '1234567890',
    address: 'Test Address',
    dob: '1990-01-01',
    gender: 'MALE',
    role: 'PATIENT'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

## 🔍 **Debugging Steps**

### **1. Check Backend Logs**
Look for these log messages when starting the application:
```
INFO  - Started WellnessManagementApplication
INFO  - Tomcat started on port(s): 8080
```

### **2. Check CORS Headers**
In browser Network tab, check if these headers are present in the response:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH`
- `Access-Control-Allow-Headers: *`

### **3. Check Preflight Request**
Look for OPTIONS request in Network tab before the actual POST request.

## 🛠️ **Additional Fixes**

### **If CORS still doesn't work, try these:**

#### **Option 1: Add @CrossOrigin to Controller**
```java
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class AuthController {
    // ... existing code
}
```

#### **Option 2: Add CORS Filter**
```java
@Component
public class CorsFilter implements Filter {
    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) res;
        HttpServletRequest request = (HttpServletRequest) req;
        
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "*");
        response.setHeader("Access-Control-Max-Age", "3600");
        
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            chain.doFilter(req, res);
        }
    }
}
```

#### **Option 3: Update Frontend Configuration**
In `frontend/src/services/authService.js`:
```javascript
const API_URL = 'http://localhost:8080/api';

// Add axios defaults
axios.defaults.withCredentials = true;
```

## 🚀 **Quick Fix Commands**

### **Restart Backend**
```bash
# Stop the current backend (Ctrl+C)
# Then restart
mvn spring-boot:run
```

### **Restart Frontend**
```bash
# In frontend directory
npm start
```

### **Clear Browser Cache**
- Open Developer Tools (F12)
- Right-click refresh button
- Select "Empty Cache and Hard Reload"

## 📋 **Verification Checklist**

- ✅ Backend running on port 8080
- ✅ Frontend running on port 3000
- ✅ CORS configuration applied
- ✅ No context path conflicts
- ✅ Test endpoint accessible
- ✅ Registration endpoint accessible
- ✅ Browser console shows no CORS errors

## 🆘 **If Still Not Working**

1. **Check if backend is actually running:**
   ```bash
   curl http://localhost:8080/api/auth/health
   ```

2. **Check if frontend can reach backend:**
   ```bash
   curl -X OPTIONS http://localhost:8080/api/auth/register
   ```

3. **Check browser console for detailed error messages**

4. **Try different browser or incognito mode**

5. **Check if any antivirus or firewall is blocking the connection**

---

**After applying these fixes, your CORS issue should be resolved!** 🎉

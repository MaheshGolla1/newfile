# Healthcare & Wellness Management System

A comprehensive healthcare management platform built with React.js for managing doctor-patient appointments, payments, and administrative tasks.

## 🏥 Features

### For Patients
- **User Registration & Login**: Secure authentication with role-based access
- **Doctor Discovery**: Browse available doctors by specialization
- **Appointment Booking**: Schedule appointments with preferred doctors
- **Payment Processing**: Secure payment system for appointment fees
- **Appointment History**: View past and upcoming appointments
- **Wellness Tracking**: Monitor health records and wellness activities

### For Doctors
- **Patient Management**: View patient list and appointment history
- **Schedule Management**: Set availability and manage appointments
- **Patient Statistics**: Track total patients and appointment metrics
- **Appointment Status Updates**: Mark appointments as completed/cancelled

### For Administrators
- **System Overview**: Dashboard with key metrics and statistics
- **User Management**: View all doctors, patients, and administrators
- **Appointment Monitoring**: Track all appointments across the system
- **Payment Tracking**: Monitor payment status and transactions

## 🛠️ Tech Stack

- **Frontend**: React.js with modern CSS-in-JS
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **Routing**: React Router DOM
- **Storage**: LocalStorage for data persistence
- **UI Components**: Custom modern components with responsive design
- **Styling**: CSS-in-JS with modern gradients and animations

## 📊 Data Models

### Patients
```javascript
{
  id: string,
  name: string,
  email: string,
  password: string,
  phone: string,
  address: string,
  dob: string,
  gender: string,
  role: 'patient'
}
```

### Doctors
```javascript
{
  id: string,
  name: string,
  email: string,
  password: string,
  specialization: string,
  phone: string,
  role: 'doctor'
}
```

### Appointments
```javascript
{
  id: string,
  patientId: string,
  doctorId: string,
  patientName: string,
  doctorName: string,
  date: string,
  time: string,
  status: 'scheduled' | 'completed' | 'cancelled',
  notes: string,
  amount: number,
  paymentStatus: 'pending' | 'paid',
  createdAt: string
}
```

### Payments
```javascript
{
  id: string,
  patientId: string,
  appointmentId: string,
  serviceId: string,
  paymentStatus: 'completed',
  paymentDate: string,
  transactionId: string,
  amount: number
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DoctorPat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 👥 Demo Credentials

### Admin Access
- **Email**: admin@doctorpat.com
- **Password**: admin123

### Doctor Access
- **Email**: john.smith@doctor.com
- **Password**: password123
- **Email**: sarah.johnson@doctor.com
- **Password**: password123

### Patient Access
- **Email**: john.doe@patient.com
- **Password**: password123
- **Email**: jane.smith@patient.com
- **Password**: password123

## 📱 User Interface

### Modern Design
- Clean, modern UI with gradient backgrounds
- Responsive design for all device sizes
- Smooth animations and transitions
- Intuitive navigation and user experience

### Key Components
- **Landing Page**: Welcome screen with feature overview
- **Authentication**: Login and signup forms with role selection
- **Dashboards**: Role-specific dashboards with relevant information
- **Modals**: Booking and payment modals for user interactions
- **Navigation**: Responsive navbar with user-specific options

## 🔐 Security Features

- **Role-based Access Control**: Different interfaces for patients, doctors, and admins
- **Form Validation**: Client-side validation for all user inputs
- **Secure Routing**: Protected routes based on user authentication
- **Data Persistence**: LocalStorage for session management

## 💳 Payment System

- **Secure Payment Processing**: Simulated payment gateway integration
- **Transaction Tracking**: Unique transaction IDs for all payments
- **Payment Status**: Real-time payment status updates
- **Receipt Generation**: Detailed payment receipts with appointment information

## 📊 Analytics & Reporting

### Patient Analytics
- Total appointments booked
- Payment history
- Wellness tracking

### Doctor Analytics
- Total patients served
- Appointment completion rates
- Schedule utilization

### Admin Analytics
- System-wide statistics
- User registration trends
- Payment processing metrics

## 🔧 Customization

### Adding New Specializations
Edit the specialization options in the signup form:
```javascript
// In Signup.js
<option value="NewSpecialization">New Specialization</option>
```

### Modifying Appointment Fees
Update the default appointment amount:
```javascript
// In PatientDashboard.js
amount: 150, // Change default fee
```

### Adding New Features
The modular component structure makes it easy to add new features:
1. Create new components in the `src/components/` directory
2. Add routes in `App.js`
3. Update navigation as needed

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
1. Connect your repository to Netlify or Vercel
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy automatically on git push

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- **Backend Integration**: Connect to Spring Boot REST APIs
- **Database**: MySQL integration for persistent data storage
- **Real-time Notifications**: WebSocket integration for live updates
- **Video Consultations**: Integration with video calling APIs
- **Prescription Management**: Digital prescription system
- **Medical Records**: Comprehensive health record management
- **Mobile App**: React Native mobile application
- **AI Integration**: Chatbot for patient support

---

**Built with ❤️ for better healthcare management**
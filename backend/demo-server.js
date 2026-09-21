const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5002;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:8083';

// Middleware
app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage for demo
const users = [];
const todos = [];
const gpsLocations = [];
const doctors = [];
const clinics = [];

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    db: 'In-Memory Demo',
    database: 'demo',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Farm Management System with Medical, GPS Tracking & Appointments',
    version: '2.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      todos: '/api/todos',
      notifications: '/api/notifications',
      payments: '/api/payments',
      gps: '/api/gps',
      medical: '/api/medical',
      appointments: '/api/appointments'
    }
  });
});

// Auth endpoints (simplified)
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  const user = {
    _id: Date.now().toString(),
    email,
    name,
    createdAt: new Date().toISOString()
  };
  users.push(user);
  res.json({ message: 'User registered successfully', user });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (user) {
    res.json({ 
      message: 'Login successful', 
      user,
      token: 'demo-token-' + Date.now() 
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Todo endpoints (simplified)
app.get('/api/todos', (req, res) => {
  res.json({ todos });
});

app.post('/api/todos', (req, res) => {
  const todo = {
    _id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  todos.push(todo);
  res.json({ message: 'Todo created successfully', todo });
});

// GPS endpoints (simplified)
app.get('/api/gps/current', (req, res) => {
  const current = gpsLocations[gpsLocations.length - 1];
  res.json({ location: current || null });
});

app.post('/api/gps', (req, res) => {
  const location = {
    _id: Date.now().toString(),
    ...req.body,
    timestamp: new Date().toISOString()
  };
  gpsLocations.push(location);
  res.json({ message: 'Location saved successfully', location });
});

app.get('/api/gps/history', (req, res) => {
  res.json({ locations: gpsLocations });
});

// Medical endpoints (simplified)
app.get('/api/medical/doctors/nearby', (req, res) => {
  const { latitude, longitude, maxDistance = 10 } = req.query;
  
  // Demo doctors data
  const demoDoctors = [
    {
      _id: '1',
      name: 'Dr. Rajesh Kumar',
      specialization: 'General Physician',
      qualification: 'MBBS, MD',
      experience: 15,
      phone: '+91-9876543210',
      email: 'rajesh.kumar@example.com',
      clinicName: 'City Health Center',
      clinicAddress: {
        street: '123 Main Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        coordinates: { latitude: 12.9716, longitude: 77.5946 }
      },
      consultationFee: 500,
      rating: { average: 4.5, count: 150 },
      isVerified: true
    },
    {
      _id: '2',
      name: 'Dr. Priya Sharma',
      specialization: 'Veterinarian',
      qualification: 'BVSc, MVSc',
      experience: 10,
      phone: '+91-9876543211',
      email: 'priya.sharma@example.com',
      clinicName: 'Animal Care Clinic',
      clinicAddress: {
        street: '456 Pet Street',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560002',
        coordinates: { latitude: 12.9728, longitude: 77.5930 }
      },
      consultationFee: 800,
      rating: { average: 4.8, count: 89 },
      isVerified: true
    }
  ];
  
  res.json({ doctors: demoDoctors });
});

app.get('/api/medical/clinics/nearby', (req, res) => {
  const { latitude, longitude, maxDistance = 10 } = req.query;
  
  // Demo clinics data
  const demoClinics = [
    {
      _id: '1',
      name: 'City General Hospital',
      type: 'General Clinic',
      address: {
        street: '789 Hospital Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560003',
        coordinates: { latitude: 12.9705, longitude: 77.5955 }
      },
      contact: {
        phone: '+91-80-1234567',
        email: 'info@cityhospital.com'
      },
      rating: { average: 4.2, count: 200 }
    },
    {
      _id: '2',
      name: 'Rural Health Center',
      type: 'Primary Health Center',
      address: {
        street: '101 Village Road',
        city: 'Bangalore Rural',
        state: 'Karnataka',
        pincode: '560004',
        coordinates: { latitude: 12.9695, longitude: 77.5965 }
      },
      contact: {
        phone: '+91-80-7654321',
        email: 'rural@health.gov.in'
      },
      rating: { average: 3.9, count: 75 }
    }
  ];
  
  res.json({ clinics: demoClinics });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Demo Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Frontend URL: ${CLIENT_ORIGIN}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
});

module.exports = app;

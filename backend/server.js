const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

// Trust proxy for Render / Cloudflare
app.enable('trust proxy');

// Allowed origins helper
const getAllowedOrigins = () => {
  const origins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
  ];

  if (process.env.CLIENT_URL) {
    // Support comma-separated URLs and strip trailing slashes
    const clientUrls = process.env.CLIENT_URL.split(',').map((url) =>
      url.trim().replace(/\/+$/, '')
    );
    origins.push(...clientUrls);
  }

  return origins;
};

// Robust CORS origin handler
const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    const allowedOrigins = getAllowedOrigins();
    const cleanOrigin = origin.replace(/\/+$/, '');

    // Allow configured origins, any Render deployment (*.onrender.com),
    // localhost/127.0.0.1, or if CLIENT_URL is '*'
    let isRenderDomain = false;
    try {
      const parsed = new URL(origin);
      isRenderDomain = parsed.hostname.endsWith('.onrender.com');
    } catch (e) {
      isRenderDomain = false;
    }

    if (
      process.env.CLIENT_URL === '*' ||
      allowedOrigins.includes(cleanOrigin) ||
      isRenderDomain ||
      cleanOrigin.startsWith('http://localhost:') ||
      cleanOrigin.startsWith('http://127.0.0.1:') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }

    // Default allow for seamless Render communication
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Support both /api/path and /path for maximum compatibility with all frontend configs
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/doctors', doctorRoutes);
app.use('/doctors', doctorRoutes);

app.use('/api/patients', patientRoutes);
app.use('/patients', patientRoutes);

app.use('/api/appointments', appointmentRoutes);
app.use('/appointments', appointmentRoutes);

app.use('/api/admin', adminRoutes);
app.use('/admin', adminRoutes);

app.get(['/', '/api'], (req, res) => {
  res.json({ message: 'Doctor Appointment API is running' });
});

// Error handler
app.use(require('./middleware/errorMiddleware'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});


// server/index.js

// 1. Require built-in modules first
const fs = require('fs');
const path = require('path');

// 2. Require third-party modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

// 3. Define envPath and configure dotenv
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });

// 4. Require your local modules (routes)
const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');
const aiRoutes = require('./routes/ai');

// 5. Initialize Express app
const app = express();

// Security Middlewares
app.use(helmet());

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP for API access, please try again later.'
});
app.use('/api/', apiLimiter);

// --- THIS IS THE UPDATED CORS CONFIGURATION ---
const allowedOrigins = [
    'http://localhost:5173', // Your local development URL
    process.env.CLIENT_URL    // Your live production URL from the .env file on App Runner
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Check if the origin is in our allowed list
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    optionsSuccessStatus: 200
}));
// --- END OF UPDATED CORS CONFIGURATION ---


// Core Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/ai', aiRoutes);

// Basic route for testing server status
app.get('/', (req, res) => {
  res.send('Maternity Matters API is alive and running!');
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Successfully connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('MongoDB connection error. Please ensure MongoDB is running and MONGO_URI is set correctly.');
    console.error(err.message);
    process.exit(1);
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack || err);
  res.status(err.status || 500).json({
    error: err.message || 'An unexpected error occurred on the server.'
  });
});
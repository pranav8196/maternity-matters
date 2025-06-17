// server/index.js

// 1. Require built-in modules first
const fs = require('fs');
const path = require('path');

// 2. Require third-party modules (ALL OF THEM HERE)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

// 3. Define envPath (uses 'path' module, so 'path' must be required above)
const envPath = path.resolve(__dirname, '.env');

// 4. Commented out debugging logs
// ...

// 5. Configure dotenv
dotenv.config({ path: envPath });

// 6. Commented out debugging logs
// ...

// 7. Require your local modules (routes) AFTER dotenv has configured process.env
const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');
const aiRoutes = require('./routes/ai'); // <<< --- 1. IMPORT THE NEW AI ROUTE

// 8. Initialize Express app
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

// Core Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/ai', aiRoutes); // <<< --- 2. USE THE NEW AI ROUTE

// Basic route for testing server status
app.get('/', (req, res) => {
  res.send('Maternity Matters API is alive and running!'); // Updated message for branding
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
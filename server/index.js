// server/index.js

// 1. Require built-in modules first
const fs = require('fs');
const path = require('path');

// 2. Require third-party modules (ALL OF THEM HERE)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv'); // <<< MOVED HERE (and ensure it's only once)
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

// 3. Define envPath (uses 'path' module, so 'path' must be required above)
const envPath = path.resolve(__dirname, '.env');

// 4. Perform the .env file check (uses 'fs' and 'envPath')
// console.log(`--- .env File Check ---`);
// console.log(`Looking for .env at: ${envPath}`);
//if (fs.existsSync(envPath)) {
//    console.log(`.env file found!`);
//    try {
//        const envContent = fs.readFileSync(envPath, 'utf8');
//        console.log('Raw content of .env file:');
//       console.log('------------------------------------');
//        console.log(envContent);
//        console.log('------------------------------------');
//    } catch (readError) {
//        console.error('Error reading .env file:', readError);
//    }
//  else {
//    console.log(`.env file NOT found at the specified path.`);
// }
// console.log(`--- End .env File Check ---\n`);

// 5. NOW, configure dotenv (after 'dotenv' has been required and 'envPath' is defined)
const dotenvResult = dotenv.config({ path: envPath }); // This is the primary call to load .env

// console.log('--- dotenv.config() Result ---');
// if (dotenvResult.error) {
//    console.error('Error loading .env file from dotenv:', dotenvResult.error);
// } else {
//     console.log('Variables parsed by dotenv:', dotenvResult.parsed);
// }
// console.log('--- End dotenv.config() Result ---\n');

// 6. TEMPORARY: Check process.env immediately after dotenv.config()
//console.log("--- process.env check in index.js (after dotenv.config) ---");
//console.log("process.env.EMAIL_USER (in index.js):", process.env.EMAIL_USER);
//console.log("process.env.EMAIL_PASS is set (in index.js):", !!process.env.EMAIL_PASS ? "Yes" : "No");
//console.log("process.env.EMAIL_SERVICE (in index.js):", process.env.EMAIL_SERVICE);
//console.log("----------------------------------------------------------\n");

// 7. Require your local modules (routes) AFTER dotenv has configured process.env
const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');

// 8. Initialize Express app
const app = express();



// Security Middlewares
app.use(helmet()); // Sets various security-related HTTP headers

// Rate Limiting - Apply to API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs for API routes
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP for API access, please try again later.'
});
app.use('/api/', apiLimiter); // Apply rate limiting specifically to /api routes

// Core Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Allow requests from your client
    optionsSuccessStatus: 200
}));
app.use(express.json()); // Parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true })); // Parses incoming requests with URL-encoded payloads

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Logs requests to the console in 'dev' format
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

// Basic route for testing server status
app.get('/', (req, res) => {
  res.send('Maternity Benefit Portal API is alive and running!');
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
    process.exit(1); // Exit process with failure
});

// Global Error Handler Middleware
// This should be the last piece of middleware added
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack || err);
  res.status(err.status || 500).json({
    error: err.message || 'An unexpected error occurred on the server.'
  });
});
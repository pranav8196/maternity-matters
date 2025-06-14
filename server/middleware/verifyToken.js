const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1]; // Extract token from "Bearer TOKEN"

        if (!token) {
            // This case should ideally not be hit if header.startsWith is true and split works,
            // but as a safeguard:
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ error: 'Token expired. Please log in again.' });
                }
                // For other errors like JsonWebTokenError (malformed token)
                return res.status(401).json({ error: 'Invalid token. Authentication failed.' });
            }
            // If token is valid, attach decoded payload (which includes user ID) to request object
            req.userId = decoded.id;
            req.userEmail = decoded.email; // If you included email in JWT payload
            next(); // Proceed to the next middleware or route handler
        });
    } else {
        // No Authorization header or not in Bearer format
        return res.status(401).json({ error: 'Access denied. Authorization header missing or malformed.' });
    }
}

module.exports = verifyToken;
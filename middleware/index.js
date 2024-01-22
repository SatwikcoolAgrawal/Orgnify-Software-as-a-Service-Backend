const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../' });

/**
 * Middleware function to authorize and decode JWT tokens from request headers.
 * If a valid token is found, it verifies and decodes it, then attaches user data to the request object.
 * If no token is found, the token is invalid, or an error occurs during decoding, it returns an appropriate response.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function to pass control to the next middleware/route handler
 */
const authorizerMiddleware = (req, res, next) => {
    try {
        // Check if the Authorization header is present in the request
        if (!req.headers.authorization) {
            return res.status(400).json({ error: "Token not found in headers" });
        }

        // Extract the token from the Authorization header
        // const token = req.headers.authorization.split(' ')[1];
        const token = req.headers.authorization;

        // Verify and decode the JWT token
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                // If the token is invalid or expired, return an unauthorized response
                return res.status(401).json({ error: "Unauthorized", details: err.message });
            }

            // Attach the decoded user data to the request object
            req.user = decodedToken;

            // Continue to the next middleware/route handler
            next();
        });
    } catch (error) {
        // Handle any errors that occur during decoding
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

// Export the authorizer middleware for use in other parts of the application
module.exports = authorizerMiddleware;
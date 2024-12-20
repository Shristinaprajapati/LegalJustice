const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Get the token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token
    
    if (!token) {
        return res.status(401).send({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token using the private key (ensure process.env.JWTPRIVATEKEY is set correctly)
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);

        // Attach the decoded user info to the request object (for easy access in the route handler)
        req.user = decoded;

        // Proceed to the next middleware/route handler
        next();
    } catch (error) {
        res.status(400).send({ message: 'Invalid token.' });
    }
};

module.exports = authMiddleware;

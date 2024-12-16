import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT token
export const verifyToken = (request, response, next) => {
    // Get token from auth header
    const token = request.headers['authorization'] && request.headers['authorization'].split(' ')[1];
    if(!token){
        return response.status(403).json({ message: 'No token provided. Please log in.' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        request.user = decoded;
        next();
    } catch (err) {
        console.error('JWT verification error:', err);
        return response.status(401).json({ message: 'Invalid or expired token.' });
    }
};
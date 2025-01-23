import dotenv from 'dotenv';
import jsonwebtoken from 'jsonwebtoken';

dotenv.config();

const JWT_KEY = process.env.JWT_KEY || 'your-secret-key';

// Middleware to verify JWT token
export const verifyToken = (request, response, next) => {
    const token = request.cookies.token;
    if (!token) {
        return response.status(403).json({ message: 'Token not found during verification in middleware.' });
    }
    try {
        const decoded = jsonwebtoken.verify(token, JWT_KEY);
        request.userId = decoded.user.id;
        // request.token = token;
        next();
    } catch (err) {
        console.error('JWT verification error:', err);
        return response.status(401).json({ message: 'Invalid or expired token.' });
    }
};
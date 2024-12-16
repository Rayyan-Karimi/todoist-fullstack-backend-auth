import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'your-personal-jwt-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-secret';

const refreshTokens = [];

export const registerUser = async (request, response) => {
    try {
        const { name, email, password } = request.body;

        const existingUser = await User.findAll(null);
        if(existingUser.some(user => user.email === email)) {
            return response.status(400).json({ message: 'Email is already in use.' });
        }
        const newUser = new User(name, email, password);
        const createdUser = await User.create(newUser);

        response.status(201).send({ message: "Created new user successfully.", user: createdUser })
    } catch (err) {
        console.error("Error during registration:", err);
        response.status(500).send({ message: 'Error registering user.', error: err.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByEmail(email);
        if(!user) {
            return res.status(404).send({ message: 'User not found.' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(401).send({ message: 'Invalid password.' });
        }
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '15m' }
        );
        const refreshToken = jwt.sign(
            { userId: user.id, email: user.email },
            REFRESH_SECRET,
            { expiresIn: '7d' }
        );
        refreshTokens.push(refreshToken);
        res.status(200).json({ 
            message: 'Login successful.', 
            access_token: token, 
            refresh_token: refreshToken 
        })
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ message: 'Error logging in user', error: err.message })
    }
};

export const refreshAccessTokens = (request, response) => {
    const { refreshToken } = request.body;
    if(!refreshToken) {
        return response.status(401).json({ message: "Refresh token is required" });
    }
    if (!refreshTokens.includes(refreshToken)) {
        return response.status(403).json({ message: "Invalid refresh token / All old refresh tokens have expired." });
    }
    jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
        if (err) return response.status(403).json({ message: "Invalid refresh token" });
        const accessToken = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '15m' }
        );
        response.status(200).json({ accessToken });
    })
};

export const logoutUser = (request, response) => {
    const { refreshToken } = request.body;
    if(!refreshToken) {
        return response.status(400).json({ message: 'Refresh token is required.' });
    }
    const index = refreshTokens.indexOf(refreshToken);
    if(index !== -1) {
        refreshTokens.splice(index, 1); // Remove token from our storage
    }
    response.status(200).json({ message: "Logged out successfully." });
};
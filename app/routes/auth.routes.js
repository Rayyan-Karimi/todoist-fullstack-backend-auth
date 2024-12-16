import express from 'express';
import * as authController from '../controllers/auth.controller.js';

const AuthRoutes = (server) => {
    const router = express.Router();
    
    router.post('/register', authController.registerUser);
    
    // You will get AccessToken and RefreshToken from the valid login.
    router.post('/login', authController.loginUser);
    // Use AccessToken to access protected routes

    // Use RefreshToken in below API to get a new AccessToken if older AccessToken expires.
    router.post('/refresh', authController.refreshAccessTokens);

    // Send RefreshToken to below API to invalidate it.
    router.post('/logout', authController.logoutUser);
    
    server.use('/api/auth', router);
};

export default AuthRoutes;
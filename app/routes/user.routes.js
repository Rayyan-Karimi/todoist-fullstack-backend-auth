import express from 'express'
import * as UserController from '../controllers/user.controller.js'
import { verifyToken } from '../middleware/auth.middleware.js'

const UserRoutes = (server) => {
    const router = express.Router()
    router.get('/validate', UserController.validateUser);
    router.post('/register', UserController.createNewUser)
    router.post('/login', UserController.login)
    router.post('/logout', verifyToken, UserController.logout)
    router.get('/', verifyToken, UserController.read)
    router.get('/:id', verifyToken, UserController.read)
    router.put('/:id', verifyToken, UserController.updateUser)
    router.delete('/:id', verifyToken, UserController.deleteUser)
    router.delete('/', verifyToken, UserController.deleteUser)
    server.use('/api/users', router)
}

export default UserRoutes

import express from 'express'
import * as UserController from '../controllers/user.controller.js'

const UserRoutes = (server) => {
    const router = express.Router()
    router.post('/register', UserController.createNewUser)
    router.post('/login', UserController.login)
    router.post('/logout', UserController.logout)
    router.get('/', UserController.read)
    router.get('/:id', UserController.read)
    router.put('/:id', UserController.updateUser)
    router.delete('/:id', UserController.deleteUser)
    router.delete('/', UserController.deleteUser)
    server.use('/api/users', router)
}

export default UserRoutes

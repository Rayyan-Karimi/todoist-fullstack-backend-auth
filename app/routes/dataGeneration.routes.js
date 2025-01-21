import express from 'express'
import { addFakeData } from '../controllers/data.controller.js'

const AddDataRoutes = (server) => {
    const router = express.Router()
    router.post('/', addFakeData)
    server.use('/api/addData', router)
}

export default AddDataRoutes

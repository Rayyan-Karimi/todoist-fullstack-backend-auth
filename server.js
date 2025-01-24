// library imports
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
// internal imports
import { createTables } from './app/db/db.config.js'
import UsersRoutes from './app/routes/user.routes.js'
import CommentRoutes from './app/routes/comments.routes.js'
import ProjectRoutes from './app/routes/projects.routes.js'
import TaskRoutes from './app/routes/tasks.routes.js'
import AddDataRoutes from './app/routes/dataGeneration.routes.js'
// setup server
const server = express()
var corsRequestOptions = {
    origin: process.env.FRONTEND_PORT,
    credentials: true
}
server.use(cors(corsRequestOptions))
server.use(cookieParser())
server.use(express.json())
server.use(bodyParser.json())
server.use(express.urlencoded({ extended: true }))
server.get("/", (request, response) => {
    response.json({ message: "Welcome to Rayyan's server." })
})
dotenv.config();
// db-creation
createTables();
// add routes
AddDataRoutes(server)
ProjectRoutes(server)
TaskRoutes(server)
CommentRoutes(server)
UsersRoutes(server)
// start server
const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
    console.log("Server started on", PORT)
})


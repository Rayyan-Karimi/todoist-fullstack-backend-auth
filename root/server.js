import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import { createTables } from '../db/dbConfig.js'

const server = express()
var corsRequestOptions = {
    origin: "http://localhost:8080"
}
server.use(cors(corsRequestOptions))
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.get("/", (request, response) => {
    response.json({ message: "Welcome to Rayyan's server." })
})

dotenv.config();

// DB creation
createTables();

// Add routes


const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
    console.log("Server started on", PORT)
})

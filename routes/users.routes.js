import express from 'express'
import * as users from "../controllers/user.controller.js"

const UsersRoutes = (server) => {
    const router = express.Router()
    router.post("/", users.createUser)
    router.get("/", users.read)
    router.get("/:id", users.read)
    router.put("/:id", users.updateUser)
    router.delete("/:id", users.deleteUser)
    router.delete("/", users.deleteUser)
    server.use("/api/users", router)
}

export default UsersRoutes;
import express from 'express'
import * as comments from "../controllers/comments.controller.js"

const CommentRoutes = (server) => {
    const router = express.Router()
    router.post("/", comments.createComment)
    router.get("/", comments.readComments)
    router.get("/:id", comments.readComments)
    router.put("/:id", comments.updateComment)
    router.delete("/:id", comments.deleteComment)
    router.delete("/", comments.deleteComment)
    server.use("/api/comments", router)
}

export default CommentRoutes
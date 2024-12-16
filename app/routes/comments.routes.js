import express from 'express';
import * as comments from "../controllers/comments.controller.js";
import { verifyToken } from '../middleware/auth.middleware.js';

const CommentRoutes = (server) => {
    const router = express.Router()
    router.post("/", verifyToken, comments.createComment)
    router.put("/:id", verifyToken, comments.updateComment)
    router.delete("/:id", verifyToken, comments.deleteComment)
    
    router.get("/", comments.readComments)
    router.get("/:id", comments.readComments)
    
    server.use("/api/comments", router)
}

export default CommentRoutes
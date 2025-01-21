import express from 'express';
import * as projects from "../controllers/projects.controller.js";
import { verifyToken } from '../middleware/auth.middleware.js';

const ProjectRoutes = (server) => {
    const router = express.Router()
    router.post("/", verifyToken, projects.createProject)
    router.patch("/:id", verifyToken, projects.updateProjectIsFavorite)
    router.put("/:id", verifyToken, projects.updateProject)
    router.patch("/:id", verifyToken, projects.updateProjectIsFavorite)
    router.delete("/:id", verifyToken, projects.deleteProject)


    // router.post("/", projects.createProject)
    // router.patch("/:id", projects.updateProjectIsFavorite)
    // router.put("/:id", projects.updateProject)
    // router.delete("/:id", projects.deleteProject)

    router.get("/", verifyToken, projects.read)
    router.get("/:id", verifyToken, projects.read)

    server.use("/api/projects", router)
}
export default ProjectRoutes;
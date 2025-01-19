import express from 'express';
import * as tasks from '../controllers/tasks.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const TaskRoutes = (server) => {
    const router = express.Router();
    // router.post("/", verifyToken, tasks.createTask);
    // router.put("/:id", verifyToken, tasks.updateTask);
    // router.delete("/", verifyToken, tasks.deleteTask);
    // router.delete("/:id", verifyToken, tasks.deleteTask);


    router.post("/", tasks.createTask);
    router.put("/:id", tasks.updateTask);
    router.delete("/", tasks.deleteTask);
    router.delete("/:id", tasks.deleteTask);

    router.get("/", tasks.read);
    router.get("/filter", tasks.filter);
    router.get("/:id", tasks.read);

    server.use("/api/tasks", router);
};
export default TaskRoutes;
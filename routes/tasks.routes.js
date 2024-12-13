import express from 'express';
import * as tasks from '../controllers/tasks.controller.js';
const TaskRoutes = (server) => {
    const router = express.Router()
    router.post("/", tasks.createTask)
    router.get("/", tasks.read)
    router.get("/filter", tasks.filter)
    router.get("/:id", tasks.read)
    router.put("/:id", tasks.updateTask)
    router.delete("/", tasks.deleteTask)
    router.delete("/:id", tasks.deleteTask)
    router.post("/filter", tasks.filter)
    server.use("/api/tasks", router)
};
export default TaskRoutes;
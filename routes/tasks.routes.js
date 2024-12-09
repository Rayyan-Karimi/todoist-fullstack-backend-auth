import express from 'express'
import * as tasks from '../controllers/tasks.controller.js'
const TaskRoutes = (server) => {
    const router = express.Router()
    router.post("/", tasks.createTask)
    router.get("/", tasks.read)
    router.put("/:id", tasks.updateTask)
    router.delete("/", tasks.deleteTask)
    server.use("/api/tasks", router)
};
export default TaskRoutes;
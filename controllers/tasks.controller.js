import Task from '../models/tasks.model.js';
import { taskSchema } from '../validation/tasks.js'

export const createTask = async (request, response) => {
    try {
        const validatedTask = await taskSchema.validate(request.body, { abortEarly: false });
        const task = new Task(
            validatedTask.content,
            validatedTask.description,
            validatedTask.due_date,
            validatedTask.is_completed || 0,
            validatedTask.project_id
        );
        const responseData = await Task.create(task);
        response.send({ message: "Creation success.", addition: responseData })
    } catch (err) {
        if (err.name === "ValidationError") {
            const errors = err.inner.map((e) => ({
                field: e.path,
                message: e.message
            }))
            response.status(400).send({ errors });
        } else {
            console.error("Error:", err)
            response.status(500).json({
                message: "Error creating Task",
                error: {
                    name: err.name,
                    code: err.code,
                    details: err.message
                }
            });
        }
    }
};

export const read = async (request, response) => {
    try {
        const taskId = request.params.id;
        const responseData = await Task.findAll(taskId);
        if (!responseData || responseData.length === 0) {
            response.status(404).send({ message: taskId ? `No task found with the given ID ${taskId}` : "No tasks found.", });
        } else {
            response.status(200).send(responseData);
        }
    } catch (err) {
        response.status(500).send({ message: err.message || "Some error occurred while reading the data" });
    }
}

export const filter = async (request, response) => {
    try {
        const { project_id: projectId, due_date: dueDate, is_completed: isCompleted, created_at: createdAt } = request.query;
        const responseData = await Task.filter({ projectId, dueDate, isCompleted, createdAt })
        response.status(200).send(responseData);
    } catch (err) {
        response.status(500).send({ message: err.message || "Server error" })
    }
}

export const updateTask = async (request, response) => {
    try {
        const validatedTask = await taskSchema.validate(request.body, { abortEarly: false })
        const taskId = request.params.id;
        const responseData = await Task.update(taskId, validatedTask)
        if (responseData.message) {
            return response.status(404).send(responseData);
        } else {
            return response.status(200).send({ message: "Task updated successfully", task: responseData });
        }
    } catch (err) {
        if (err.name === "ValidationError") {
            const errors = err.inner.map((e) => ({
                field: e.path,
                message: e.message,
            }));
            response.status(400).send({ errors });
        } else {
            response.status(500).send({
                message: "Error updating task.",
                error: err.message || "Unknown error occurred.",
            });
        }
    }
};

export const deleteTask = async (request, response) => {
    try {
        const taskId = request.params.id;
        const responseData = await Task.remove(taskId)
        response.status(200).send(responseData);
    } catch (err) {
        response.status(500).send({ message: err.message || "Server error" })
    }
};
import e from 'express';
import Task from '../models/tasks.model.js';

export const createTask = async (request, response) => {
    try {
        if (!request.body) {
            console.error("Request cannot be empty")
            return response.status(400).send({ message: "Request cannot be empty" })
        }
        const task = new Task(
            request.body.content,
            request.body.description,
            request.body.due_date,
            request.body.is_completed || 0,
            request.body.project_id,
        )
        const responseData = await Task.create(task);
        response.send({ message: "Creation success.", addition: responseData })
    } catch (err) {
        return response.status(500).send({ message: err.message || "Some error occurred while creating the Task." })
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
        if (!request.body) {
            console.error("Request cannot be empty")
            return response.status(400).send({ message: "Request cannot be empty" })
        }
        const updatedTask = new Task(
            request.body.content,
            request.body.description,
            request.body.due_date,
            request.body.is_completed,
            request.body.project_id
        )
        const taskId = request.params.id;
        const responseData = await Task.update(taskId, updatedTask)
        if (responseData.message) {
            return response.status(404).send(responseData);
        } else {
            return response.status(200).send(responseData);
        }
    } catch (err) {
        response.status(500).send({ message: err.message || "Some error occurred while reading the data" });
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
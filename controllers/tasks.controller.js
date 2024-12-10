import Task from '../models/tasks.model.js';

export const createTask = (request, response) => {
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
    Task.create(task, (err, responseData) => {
        if (err) {
            return response.status(500).send({ message: err.message || "Some error occurred while creating the Task." })
        }
        response.send(responseData)
    })
};

export const read = (request, response) => {
    const taskId = request.params.id;
    Task.findAll(taskId, (err, responseData) => {
        if (err) {
            console.error("Some error occurred while reading the Task(s)", err.message)
            response.status(500).send({ message: err.message || "Some error occurred while reading the Task(s)" })
        } else if (!responseData || responseData.length === 0) {
            console.error(taskId ? `No task found with the given ID ${taskId}` : "No tasks found.")
            response.status(404).send({ message: taskId ? `No task found with the given ID ${taskId}` : "No tasks found.", });
        } else {
            console.log(responseData)
            response.send(responseData);
        }
    })
};

export const updateTask = (request, response) => {
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
    Task.update(taskId, updatedTask, (err, responseData) => {
        if (err) {
            return response.status(500).send({ message: err.message || "Some error occurred while update of Task." })
        } else if (!responseData) {
            return response.status(404).send({ message: `No task found with id= ${taskId}` })
        } else {
            response.send(responseData)
        }
    })
};

export const deleteTask = (request, response) => {
    const taskId = request.params.id;
    Task.remove(taskId, (err, responseData) => {
        if (err) {
            return response.status(500).send({ message: err.message || "Some error occurred while attempting delete of Task." })
        } else if (!responseData) {
            response.status(404).send({ message: taskId ? `Task with ID ${taskId} not found.` : "No tasks found to delete.", })
        } else {
            response.send(responseData)
        }
    })
};
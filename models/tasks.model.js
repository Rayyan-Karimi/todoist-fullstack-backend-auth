import db from '../db/dbConfig.js'

class Task {
    constructor(id, content, description, due_date, is_completed, created_at, project_id) {
        this.id = id;
        this.content = content;
        this.description = description;
        this.due_date = due_date;
        this.is_completed = is_completed;
        this.created_at = created_at;
        this.project_id = project_id;
    }

    static create(newTask, response) {
        const query = `
        INSERT INTO tasks (content, description, due_date, is_completed, created_at, project_id)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
        `;
        const params = [newTask.content, newTask.description, newTask.due_date, newTask.is_completed, newTask.project_id]
        db.run(query, params, function (err) {
            if (err) {
                console.error("Error creating new Task", err.message)
                response(err, null)
            } else {
                console.log("Created new Task successfully!", { id: this.lastID, ...newTask })
                response(null, { id: this.lastID, ...newTask })
            }
        })
    }

    static findAll(taskId, response) {
        let query = "Select * from tasks"
        if (taskId) query += ` Where id = ${taskId}`
        db.run(query, (err, rows) => {
            if (err) {
                const errorMessage = taskId ? `Error retrieving task with ID ${taskId}` : "Error retrieving all tasks";
                console.error(errorMessage, err.message);
                response(err, null);
            } else {
                const successMessage = taskId ? `Task with ID ${taskId} retrieved successfully!` : "All tasks retrieved successfully!";
                console.log(successMessage);
                response(null, rows);
            }
        })
    }

    static update(taskId, updatedTask, response) {
        const query = `
        UPDATE tasks
        SET content = ?, description = ?, due_date = ?, is_completed = ?, project_id = ?
        WHERE id = ?
        `;
        const params = [updatedTask.content, updatedTask.description, updatedTask.due_date, updatedTask.is_completed, updatedTask.project_id, taskId];

        db.run(query, params, function (err) {
            if (err) {
                console.error("Error updating the Task with task id =", taskId, err.message);
                response(err, null);
            } else if (this.changes === 0) {
                console.log("No task found with id =", taskId);
                response({ message: `No task found with id=${taskId}` }, null);
            } else {
                console.log("Updated task with id =", taskId, updatedTask);
                response(null, { id: taskId, ...updatedTask });
            }
        });
    }

    static remove(taskId, response) {
        let query = "DELETE FROM tasks";
        if (taskId) query += ` WHERE id = ${taskId}`;
        db.run(query, params, function (err) {
            if (err) {
                console.error(`Error deleting task(s):`, err.message);
                response(err, null);
            } else if (taskId && this.changes === 0) {
                console.log(`No task found with ID ${taskId}`);
                response({ message: "No task found with the given ID." }, null);
            } else {
                const message = taskId ? `Task with ID ${taskId} deleted successfully!` : "All tasks deleted successfully!";
                response(null, { message: message });
                console.log(message);
            }
        });
    }
}
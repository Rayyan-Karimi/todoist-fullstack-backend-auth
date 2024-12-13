import { db } from '../db/db.config.js';

class Task {
    constructor(content, description, due_date, is_completed, project_id, created_at) {
        this.content = content;
        this.description = description;
        this.due_date = due_date;
        this.project_id = project_id;
        this.is_completed = is_completed;
        this.created_at = created_at;
    }

    static create(newTask) {
        return new Promise((resolve, reject) => {
            const query = `
            INSERT INTO tasks (content, description, due_date, is_completed, created_at, project_id)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
            `;
            const params = [newTask.content, newTask.description, newTask.due_date, newTask.is_completed, newTask.project_id]
            db.run(query, params, function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, ...newTask });
            })
        })
    }

    static findAll(taskId) {
        return new Promise((resolve, reject) => {
            let query = "Select * from tasks"
            if (taskId) query += ` Where id = ${taskId}`
            db.all(query, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            })
        })

    }

    static filter = ({ projectId, dueDate, isCompleted, createdAt }) => {
        return new Promise((resolve, reject) => {
            let query = `SELECT * FROM tasks WHERE 1=1`;
            const params = [];
            if (projectId) {
                query += ` and project_id = ?`
                params.push(projectId)
            }
            if (dueDate) {
                query += ` and due_date like ?`
                params.push(`%${dueDate}%`)
            }
            if (isCompleted) {
                query += ` and is_completed = ?`
                params.push(isCompleted)
            }
            if (createdAt) {
                query += ` and created_at like ?`
                params.push(`%${createdAt}%`)
            }
            db.all(query, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            })
        })
    }

    static update(taskId, updatedTask) {
        return new Promise((resolve, reject) => {
            const query = `
            UPDATE tasks
            SET content = ?, description = ?, due_date = ?, is_completed = ?, project_id = ?
            WHERE id = ?
            `;
            const params = [updatedTask.content, updatedTask.description, updatedTask.due_date, updatedTask.is_completed, updatedTask.project_id, taskId];
            db.run(query, params, function (err) {
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    resolve({ message: `No task found with id=${taskId}` });
                } else {
                    resolve({ id: taskId, ...updatedTask });
                }
            });
        })
    }

    static remove(taskId) {
        return new Promise((resolve, reject) => {
            let query = "DELETE FROM tasks";
            if (taskId) query += ` WHERE id = ${taskId}`;
            db.run(query, function (err) {
                if (err) {
                    reject(err);
                } else if (taskId && this.changes === 0) {
                    resolve({ message: `No task found with id=${taskId}` });
                } else {
                    const deleteMessage = taskId ? `Task with ID ${taskId} deleted successfully!` : "All tasks deleted successfully!";
                    resolve(taskId ? { id: taskId, deleteMessage } : { deleteMessage });
                }
            });
        })
    }
}

export default Task;
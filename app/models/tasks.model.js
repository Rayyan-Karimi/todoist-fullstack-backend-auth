import { db } from '../db/db.config.js';

class Task {
    constructor(content, description, dueDate, isCompleted, projectId, createdAt) {
        this.content = content;
        this.description = description;
        this.dueDate = dueDate;
        this.projectId = projectId;
        this.isCompleted = isCompleted;
        this.createdAt = createdAt;
    }

    static create(newTask) {
        return new Promise((resolve, reject) => {
            const query = `
            INSERT INTO tasks (content, description, dueDate, isCompleted, createdAt, projectId)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
            `;
            const params = [newTask.content, newTask.description, newTask.dueDate, newTask.isCompleted, newTask.projectId]
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
                query += ` and projectId = ?`
                params.push(projectId)
            }
            if (dueDate) {
                query += ` and dueDate like ?`
                params.push(`%${dueDate}%`)
            }
            if (isCompleted) {
                query += ` and isCompleted = ?`
                params.push(isCompleted)
            }
            if (createdAt) {
                query += ` and createdAt like ?`
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
            SET content = ?, description = ?, dueDate = ?, isCompleted = ?, projectId = ?
            WHERE id = ?
            `;
            const params = [updatedTask.content, updatedTask.description, updatedTask.dueDate, updatedTask.isCompleted, updatedTask.projectId, taskId];
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
            let query = `DELETE FROM tasks WHERE id = ${taskId}`;
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
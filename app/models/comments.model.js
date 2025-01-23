import { db } from '../db/db.config.js';

class Comment {
    constructor(content, userId, projectId, taskId) {
        this.content = content;
        this.userId = userId;
        this.projectId = projectId;
        this.taskId = taskId;
    }

    static create(newComment) {
        return new Promise((resolve, reject) => {
            const query = `insert into comments (content, user_id, project_id, task_id) values(?, ?, ?, ?)`;
            const params = [newComment.content, newComment.userId, newComment.projectId, newComment.taskId]
            db.run(query, params, function (err) {
                if (err) {
                    console.error("Error creating new Comment", err.message)
                    reject(err);
                } else {
                    resolve({ id: this.lastID, ...newComment })
                }
            })
        })
    }

    static findAll(commentId) {
        return new Promise((resolve, reject) => {
            let query = "Select * from comments"
            if (commentId) query += ` where id = ${commentId}`
            db.all(query, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            })
        })

    }

    static update(commentId, updatedContent) {
        return new Promise((resolve, reject) => {
            let params = []
            let query = "Update comments "
            query += `set content = ? where id = ?`
            params = [updatedContent, commentId]
            db.run(query, params, function (err) {
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    resolve({ message: `No comment found with id=${commentId}` })
                } else {
                    resolve({ id: commentId, updatedContent })
                }
            })
        })
    }

    static remove(commentId, response) {
        return new Promise((resolve, reject) => {
            let query = "Delete from comments"
            if (commentId) query += ` where id = ${commentId}`
            db.run(query, function (err) {
                if (err) {
                    reject(err);
                } else if (commentId && this.changes === 0) {
                    resolve({ message: `Delete request- No comment found with the given ID - ${commentId}` }, null);
                } else {
                    const message = commentId ? `Deleted comment ID with ID = ${commentId}` : "All comments deleted successfully!";
                    resolve({ message: message });
                }
            })
        })
    }
}

export default Comment;


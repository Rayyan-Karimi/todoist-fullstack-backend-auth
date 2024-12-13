import { db } from '../db/db.config.js';

class Comment {
    constructor(content, userId, projectId, taskId) {
        this.content = content;
        this.userId = userId;
        this.projectId = projectId;
        this.taskId = taskId;
    }

    static create(newComment, response) {
        const query = `
        insert into comments (content, user_id, project_id, task_id)
        values(?, ?, ?, ?)
        `
        const params = [newComment.content, newComment.userId, newComment.projectId, newComment.taskId]
        db.run(query, params, function (err) {
            if (err) {
                console.error("Error creating new Comment", err.message)
                response(err, null);
            } else {
                console.log("Created new comment", { id: this.lastID, ...newComment })
                response(null, { id: this.lastID, ...newComment })
            }
        })
    }

    static findAll(commentId, response) {
        let query = "Select * from comments"
        if (commentId) query += ` where id = ${commentId}`
        db.all(query, (err, rows) => {
            if (err) {
                const errorMessage = commentId ? `Error retrieving comment with ID ${commentId}...`
                    : "Error retrieving all comments...";
                console.error(errorMessage, err.message)
                response(err, null);
            } else {
                const successMessage = commentId ? `Comment with ID ${commentId} retrieved successfully!`
                    : "All comments retrieved successfully!";
                console.error(successMessage)
                response(null, rows);
            }
        })
    }

    static update(commentId, updatedComment, response) {
        let params = []
        let query = "Update comments "
        if(updatedComment.taskId) {
            query += `set content = ?, task_id = ?, user_id = ? where id = ?`
            params = [updatedComment.content, updatedComment.taskId, updatedComment.userId, commentId]
        } else if(updatedComment.projectId) {
            query += `set content = ?, project_id = ?, user_id = ? where id = ?`
            params = [updatedComment.content, updatedComment.projectId, updatedComment.userId, commentId]
        }
        console.log("params", params)
        db.run(query, params, function (err) {
            if (err) {
                console.error("Error updating the Comment with comment id =", commentId, err.message)
                response(err, null);
            } else if (this.changes === 0) {
                console.log("No comment found with id=", commentId)
                response({ message: `No comment found with id=${commentId}` }, null)
            } else {
                console.log("Updated comment with id=", commentId, updatedComment)
                response(null, { id: commentId, ...updatedComment })
            }
        })
    }

    static remove(commentId, response) {
        let query = "Delete from comments"
        if (commentId) query += ` where id = ${commentId}`
        db.run(query, function (err) {
            if (err) {
                console.error(`Error deleting comment(s):`, err.message);
                response(err, null);
            } else if (commentId && this.changes === 0) {
                console.log(`Delete request- No comment found with ID ${commentId}`);
                response({ message: `Delete request- No comment found with the given ID - ${commentId}` }, null);
            } else {
                const message = commentId ? `Deleted comment ID with ID = ${commentId}` : "All comments deleted successfully!";
                response(null, { message: message });
                console.log(message);
            }
        })
    }
}

export default Comment;


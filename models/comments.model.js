import { db } from '../db/dbConfig.js';

class Comment {
    constructor(content, projectId, taskId, userId) {
        this.content = content;
        this.projectId = projectId;
        this.taskId = taskId;
        this.userId = userId;
    }

    static create(newComment, response) {
        const query = `
        insert into comments (content, project_id, task_id, user_id)
        values(?, ?, ?, ?)
        `
        const params = [newComment.content, newComment.projectId, newComment.taskId, newComment.userId]
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
        const query = `
        Update comments
        set content = ?, project_id = ?, task_id = ?, user_id = ?
        where id = ?
        `
        const params = [updatedComment.content, updatedComment.projectId, updatedComment.taskId, updatedComment.userId, commentId]
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
                const message = commentId? `Deleted comment ID with ID = ${commentId}`: "All comments deleted successfully!";
                response(null, { message: message });
                console.log(message);
            }
        })
    }
}

export default Comment;


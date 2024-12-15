
import Comment from '../models/comments.model.js';
<<<<<<< HEAD
import { commentsSchema, contentSchema } from '../validation/comments.js';

export const createComment = async (request, response) => {
    try {
        const validatedComment = await commentsSchema.validate(request.body, { abortEarly: false })
        const comment = new Comment(
            validatedComment.content,
            validatedComment.user_id,
=======
import { commentSchema, contentUpdateSchema } from '../validation/comments.js';

export const createComment = async (request, response) => {
    try {
        const validatedComment = await commentSchema.validate(request.body, { abortEarly: false })
        const comment = new Comment(
            validatedComment.user_id,
            validatedComment.content,
>>>>>>> b474e371dc18d469bb1b1fffcd49fb87a1fe1366
            validatedComment.project_id,
            validatedComment.task_id
        )
        const responseData = await Comment.create(comment);
<<<<<<< HEAD
        response.status(201).send(responseData)
=======
        response.status(201).send({ message: "Comment created", addition: responseData})
>>>>>>> b474e371dc18d469bb1b1fffcd49fb87a1fe1366
    } catch (err) {
        if (err.name === "ValidationError") {
            return response.status(400).send({
                message: "Validation failed",
                errors: err.errors, // Array of validation errors
            });
        } else {
<<<<<<< HEAD
            console.error("Error:", err)
            response.status(500).json({
                message: "Error creating comment.",
                error: {
                    name: err.name,
                    code: err.code,
                    details: err.message
                }
            });
        }
=======
            console.error("Error creating project:", err);
            return response.status(500).send({
                message: "Some error occurred while creating the project.",
                error: err.message,
            });
        } // End of error handling
>>>>>>> b474e371dc18d469bb1b1fffcd49fb87a1fe1366
    }
};

export const readComments = async (request, response) => {
    try {
        const commentId = request.params.id;
        const responseData = await Comment.findAll(commentId);
        if (!responseData || responseData.length === 0) {
            response.status(404).send({ message: commentId ? `No comment found with the given ID ${commentId}` : "No comments found.", });
        } else {
            response.status(200).send(responseData);
        }
    } catch (err) {
        response.status(500).send({ message: err.message })
    }
};

export const updateComment = async (request, response) => {
    try {
        const validatedComment = await contentSchema.validate(request.body, { abortEarly: false })
        const commentId = request.params.id;
<<<<<<< HEAD
        const responseData = await Comment.update(commentId, validatedComment.content);
=======
        const validatedContent = await contentUpdateSchema.validate(request.body.content)
        const responseData = await Comment.update(commentId, validatedContent);
>>>>>>> b474e371dc18d469bb1b1fffcd49fb87a1fe1366
        if (!responseData || responseData.length === 0) {
            response.status(404).send({ message: `No comment found with id= ${commentId}` })
        } else {
            response.status(200).send(responseData)
        }
    } catch (err) {
        if (err.name === "ValidationError") {
            return response.status(400).send({
                message: "Validation failed",
                errors: err.errors, // Array of validation errors
            });
        } else {
<<<<<<< HEAD
            console.error("Error:", err)
            response.status(500).json({
                message: "Error updating comment.",
                error: {
                    name: err.name,
                    code: err.code,
                    details: err.message
                }
            });
        }
=======
            console.error("Error creating project:", err);
            return response.status(500).send({
                message: "Some error occurred while creating the project.",
                error: err.message,
            });
        } // End of error handling
>>>>>>> b474e371dc18d469bb1b1fffcd49fb87a1fe1366
    }
};

export const deleteComment = async (request, response) => {
    try {
        const commentId = request.params.id;
        const responseData = await Comment.remove(commentId);
        if (!responseData || responseData.length === 0) {
            response.status(404).send({ message: commentId ? `Comment with ID ${commentId} not found.` : "No comments found to delete.", })
        } else {
            response.status(200).send(responseData)
        }
    } catch (err) {
        return response.status(500).send({ message: err.message || "Some error occurred while attempting delete of Comment." })
    }
};
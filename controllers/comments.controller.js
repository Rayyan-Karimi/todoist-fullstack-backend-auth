
import Comment from '../models/comments.model.js';
import { commentsSchema, contentSchema } from '../validation/comments.js';

export const createComment = async (request, response) => {
    try {
        const validatedComment = await commentsSchema.validate(request.body, { abortEarly: false })
        const comment = new Comment(
            validatedComment.content,
            validatedComment.user_id,
            validatedComment.project_id,
            validatedComment.task_id
        )
        const responseData = await Comment.create(comment);
        response.status(201).send(responseData)
    } catch (err) {
        if (err.name === "ValidationError") {
            const errors = err.inner.map((e) => ({
                field: e.path,
                message: e.message,
            }));
            response.status(400).send({ errors });
        } else {
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
        const responseData = await Comment.update(commentId, validatedComment.content);
        if (!responseData || responseData.length === 0) {
            response.status(404).send({ message: `No comment found with id= ${commentId}` })
        } else {
            response.status(200).send(responseData)
        }
    } catch (err) {
        if (err.name === "ValidationError") {
            const errors = err.inner.map((e) => ({
                field: e.path,
                message: e.message,
            }));
            response.status(400).send({ errors });
        } else {
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
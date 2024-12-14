
import Comment from '../models/comments.model.js';

export const createComment = async (request, response) => {
    try {
        const comment = new Comment(
            request.body.content,
            request.body.user_id,
            request.body.project_id,
            request.body.task_id
        )
        const responseData = await Comment.create(comment);
        response.status(200).send(responseData)
    } catch (err) {
        response.status(500).send({ message: err.message })
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
        const commentId = request.params.id;
        const responseData = await Comment.update(commentId, request.body.content);
        if (!responseData || responseData.length === 0) {
            response.status(404).send({ message: `No comment found with id= ${commentId}` })
        } else {
            response.status(200).send(responseData)
        }
    } catch (err) {
        response.status(500).send({ message: err.message })
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
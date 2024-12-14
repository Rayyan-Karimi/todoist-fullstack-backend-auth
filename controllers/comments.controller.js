
import Comment from '../models/comments.model.js';

export const createComment = (request, response) => {
    if (!request.body) {
        console.error("Request cannot be empty")
        return response.status(400).send({ message: "Request cannot be empty" })
    }
    const comment = new Comment(
        request.body.content,
        request.body.user_id,
        request.body.project_id,
        request.body.task_id
    )
    Comment.create(comment, (err, responseData) => {
        if (err) {
            return response.status(500).send({ message: err.message || "Some error occurred while creating the Comment." })
        }
        response.send(responseData)
    })
};

export const readComments = (request, response) => {
    const commentId = request.params.id;
    Comment.findAll(commentId, (err, responseData) => {
        if (err) {
            console.error("Some error occurred while reading the Comment(s)", err.message)
            response.status(500).send({ message: err.message || "Some error occurred while reading the Comment(s)" })
        } else if (!responseData || responseData.length === 0) {
            console.error(commentId ? `No comment found with the given ID ${commentId}` : "No comments found.")
            response.status(404).send({ message: commentId ? `No comment found with the given ID ${commentId}` : "No comments found.", });
        } else {
            console.log(responseData)
            response.send(responseData);
        }
    })
};

export const updateComment = (request, response) => {
    const commentId = request.params.id;
    console.log("id", commentId);
    Comment.update(commentId, request.body.content, (err, responseData) => {
        if (err) {
            console.log('Im in 500')
            return response.status(500).send({ message: err.message || "Some error occurred while update of Comment." })
        } else if (!responseData) {
            console.log('Im in 404')
            return response.status(404).send({ message: `No comment found with id= ${commentId}` })
        } else {
            console.log('Im in 200')
            response.send(responseData)
        }
    })
};

export const deleteComment = (request, response) => {
    const commentId = request.params.id;
    Comment.remove(commentId, (err, responseData) => {
        if (err) {
            return response.status(500).send({ message: err.message || "Some error occurred while attempting delete of Comment." })
        } else if (!responseData) {
            response.status(404).send({ message: commentId ? `Comment with ID ${commentId} not found.` : "No comments found to delete.", })
        } else {
            response.send(responseData)
        }
    })
};
import User from '../models/user.model.js';

export const createUser = (request, response) => {
    if (!request.body) {
        console.error("Request cannot be empty")
        return response.status(400).send({ message: "Request cannot be empty" })
    }
    const project = new User(
        request.body.name,
        request.body.email,
        request.body.password
    )

    User.create(project, (err, responseData) => {
        if (err) {
            return response.status(500).send({ message: err.message || "Some error occurred while creating the project." })
        }
        response.send(responseData)
    })
};

export const read = (request, response) => {
    const userId = request.params.id;
    User.findAll(userId, (err, responseData) => {
        if (err) {
            response.status(500).send({ message: err.message || "Some error occurred while reading the project(s)" })
        } else if (responseData.length) {
            response.send(responseData)
        } else {
            response.send({ message: userId? `No user found with ID = ${userId}`:"No users found." })
        }
    })
};

export const updateUser = (request, response) => {
    if (!request.body) {
        console.error("Request cannot be empty")
        return response.status(400).send({ message: "Request cannot be empty" })
    }
    const userId = request.params.id;
    const newEmail = request.body.email;
    const newPassword = request.body.password;
    const updatedUser = new User(
        newName,
        newEmail,
        newPassword
    )
    User.update(userId, updatedUser, (err, responseData) => {
        if (err) {
            return response.status(500).send({ message: err.message || "Some error occurred while update of project." })
        }
        response.send(responseData)
    })
     
    
};

export const deleteUser = (request, response) => {
    const userId = request.params.id;
    User.remove(userId, (err, responseData) => {
        if (err) {
            return response.status(500).send({ message: err.message || "Some error occurred while attempting delete of project." })
        }
        response.send(responseData)
    })
};
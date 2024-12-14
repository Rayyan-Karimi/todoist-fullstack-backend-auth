import User from '../models/user.model.js';

export const createUser = async (request, response) => {
    try {
        const user = new User(
            request.body.name,
            request.body.email,
            request.body.password
        )
        const responseData = await User.create(user);
        response.status(200).send(responseData)
    } catch (err) {
        response.status(500).json({ message: 'Error creating user' });
    }
};

export const read = async (request, response) => {
    try {
        const userId = request.params.id;
        const responseData = User.findAll(userId);
        response.status(200).send(responseData)
    } catch (err) {
        response.status(500).json({ error: err, message: 'Error reading user(s)' });
    }
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
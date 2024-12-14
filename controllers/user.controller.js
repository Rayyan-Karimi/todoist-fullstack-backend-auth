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
        const responseData = await User.findAll(userId);
        if (!responseData || responseData.length === 0) {
            response.status(404).send({ message: userId ? `No users found with the given ID ${userId}` : "No users found.", });
        } else {
            response.status(200).send(responseData);
        }
    } catch (err) {
        response.status(500).send({ error: err || "Some error occurred while reading the data" });
    }
};

export const updateUser = async (request, response) => {
    try {
        const userId = request.params.id;
        const { name: newName, password: newPassword } = request.body;
        const responseData = await User.update(userId, { newName, newPassword })
        response.status(200).send(responseData)
    } catch (err) {
        response.status(500).send({ error: err })
    }
};

export const deleteUser = async (request, response) => {
    try {
        const userId = request.params.id;
        const responseData = await User.remove(userId);
        response.status(200).send(responseData)
    } catch (err) {
        response.status(500).send({ error: err })
    }
};
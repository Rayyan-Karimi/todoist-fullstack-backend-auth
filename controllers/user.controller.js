import User from '../models/user.model.js';
import { postUserSchema, putUserSchema } from '../validation/users.js';

export const createUser = async (request, response) => {
    try {
        const validatedUser = await postUserSchema.validate(request.body, { abortEarly: false });
        const user = new User(
            validatedUser.name,
            validatedUser.email,
            validatedUser.password
        )
        const responseData = await User.create(user);
        response.status(200).send(responseData)
    } catch (err) {
        if (err.name === "ValidationError") {
            const errors = err.inner.map((e) => ({
                field: e.path,
                message: e.message
            }))
            response.status(400).send({ errors });
        } else {
            console.error("Error:", err)
            response.status(500).json({
                message: "Error creating user",
                error: {
                    name: err.name,
                    code: err.code,
                    details: err.message
                }
            });
        }
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
        await putUserSchema.validate(request.body, { abortEarly: false })
        const userId = request.params.id;
        const { name: newName, password: newPassword } = request.body;
        const responseData = await User.update(userId, { newName, newPassword })
        response.status(200).send(responseData)
    } catch (err) {
        if (err.name === "ValidationErrors") {
            const errors = err.inner.map((e) => ({
                field: e.path,
                message: e.message
            }))
            response.status(400).send({ errors });
        } else {
            response.status(500).send({
                message: "Error updating user",
                error: {
                    name: err.name,
                    code: err.code,
                    details: err.message
                }
            })
        }
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
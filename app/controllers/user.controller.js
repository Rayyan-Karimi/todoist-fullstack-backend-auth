import express from 'express'
import jsonwebtoken from 'jsonwebtoken'
import cookieParser from 'cookie-parser';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import User from '../models/user.model.js';
import { postUserSchema, putUserSchema } from '../validation/users.js';

const cookieOptions = { httpOnly: true, secure: false, SameSite: 'strict', expires: new Date(Number(new Date()) + 30 * 60 * 1000) };

export const validateUser = async (request, response, next) => {
    const token = request.cookies.token;
    if (!token) {
        return response.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY || 'your-secret-key');
        response.json(decoded.user);
    } catch (err) {
        response.status(401).json({ message: 'TOKEN EXPIRED/LOGIN INPUTS WERE INVALID' });
    }
}

export const createNewUser = async (req, res, next) => {
    try {
        const validatedUser = await postUserSchema.validate(req.body, { abortEarly: true });
        console.log("Validated:", validatedUser)
        // Hash the pass @FIXME: uncomment the 3 lines below
        const salt = genSaltSync(10);
        const hashedPassword = hashSync(validatedUser.password, salt);
        const newUser = new User(validatedUser.name, validatedUser.email, hashedPassword)
        // const newUser = new User(validatedUser.name, validatedUser.email, validatedUser.password)
        console.log('newUser', newUser);
        const oldUser = await User.findByEmail(newUser.email)
        if (oldUser) {
            console.log(oldUser)
            res.status(409).send({ error: 'Another user exists here with this email ID' });
            return;
        }
        console.log('.')
        const newUserInDB = await User.create(newUser)
        console.log('newUser after model call', newUserInDB)
        const jsonToken = jsonwebtoken.sign({ user: newUserInDB }, process.env.SECRET_KEY || 'your-secret-key', { expiresIn: '30m' });
        res.cookie('token', jsonToken, cookieOptions); //we add secure: true, when using https.
        res.status(201).send({ token: jsonToken, user: newUserInDB });
        //return res.redirect('/mainpage');
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

export const login = async (request, response) => {
    /**
     * add in cookie:-
     * Path=/; HttpOnly;
     */
    try {
        const validatedUser = await putUserSchema.validate(request.body, { abortEarly: true });
        console.log("Validated:", validatedUser)
        const existingUserData = await User.findByEmail(validatedUser.email)
        if (!existingUserData) {
            response.status(409).send({ error: 'No user exists here with this email ID' });
            return;
        }
        // @FIXME: uncomment the below line.
        const isValidPassword = compareSync(validatedUser.password, existingUserData.password);
        // const isValidPassword = (validatedUser.password === existingUserData.password);
        if (isValidPassword) {
            existingUserData.password = undefined;
            const jsonToken = jsonwebtoken.sign({ user: existingUserData }, process.env.JWT_KEY || 'your-secret-key', { expiresIn: '30min' })
            response.cookie('token', jsonToken, cookieOptions)
            console.log('cookie:', { token: jsonToken, user: existingUserData })
            response.status(201).send({ token: jsonToken, user: existingUserData });
        } else {
            return response.status(401).send({ error: 'Invalid password or email' });
        }
    } catch (err) {
        console.log(err);
        response.status(400).send(err);
    }
};

export const logout = async (request, response) => {
    response.clearCookie('token');
    response.status(200).send({ message: 'Logged out successfully' });
};

// @TODO: implement update & delete user in frontend.
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
        // Hash the pass
        const salt = genSaltSync(10);
        const hashedPassword = hashSync(newPassword, salt);
        const responseData = await User.update(userId, { newName, hashedPassword })
        response.status(200).send(responseData)
    } catch (err) {
        if (err.name === "ValidationErrors") {
            const errors = err.inner.map((e) => ({
                field: e.path,
                message: e.message,
            }));
            response.status(400).send({ errors });
        } else {
            response.status(404).send({
                message: "Not found the resource you are trying to access - Check your input.",
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
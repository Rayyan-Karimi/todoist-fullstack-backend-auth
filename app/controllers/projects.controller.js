import Project from '../models/projects.model.js';
import { isFavoriteProjectSchema, projectSchema } from '../validation/projects.js';

export const createProject = async (request, response) => {
    try {
        console.log("controller - create project")
        const validatedProject = await projectSchema.validate(request.body, { abortEarly: false });
        const userId = request.userId;
        console.log(">>User id from token in cookie is:", userId)
        const project = new Project(
            validatedProject.name,
            validatedProject.color || 'white',
            validatedProject.isFavorite || 0,
            userId // @TODO: how to get userId from the token
        )
        console.log('>>project created using constructor:', project)
        const responseData = await Project.create(project);
        console.log('project created using modal db connection:', responseData)
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
                message: "Error creating project",
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
        console.log("controller - read projects")
        const projectId = request.params.id;
        const userId = request.userId;
        const responseData = await Project.findAll(projectId, userId);
        if (!responseData || responseData.length === 0) {
            response.status(404).send({ message: projectId ? `No projects found with the given ID ${projectId}` : "No projects found.", });
        } else {
            response.status(200).send(responseData);
        }
    } catch (err) {
        response.status(500).send({ message: err.message || "Some error occurred while reading the data" });
    }
};

export const updateProject = async (request, response) => {
    try {
        console.log("controller - update project")
        const projectId = request.params.id;
        const validatedProject = await projectSchema.validate(request.body, { abortEarly: false });
        const userId = request.userId;
        console.log(">>User id from token in cookie is:", userId)
        const updatedProject = new Project(
            validatedProject.name,
            validatedProject.color,
            validatedProject.isFavorite || false,
            userId
        )
        const responseData = await Project.update(projectId, updatedProject);
        response.status(200).send({ ...responseData, id: Number.parseInt(responseData.id) })
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
                message: "Error updating project.",
                error: {
                    name: err.name,
                    code: err.code,
                    details: err.message
                }
            });
        }
    }
};

export const updateProjectIsFavorite = async (request, response) => {
    try {
        console.log("controller - update favorite project")
        const projectId = request.params.id;
        const validatedProject = await isFavoriteProjectSchema.validate(request.body, { abortEarly: false });
        const userId = request.userId;
        console.log(">>User id from token in cookie is:", userId)
        const newIsFavorite = validatedProject.isFavorite;
        const responseData = await Project.updateFavorite(projectId, newIsFavorite);
        response.status(200).send(responseData)
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
                message: "Error updating favorite status of project.",
                error: {
                    name: err.name,
                    code: err.code,
                    details: err.message
                }
            });
        }
    }
};

export const deleteProject = async (request, response) => {
    try {
        console.log("controller - delete project")
        const projectId = request.params.id;
        const userId = request.userId;
        console.log(">>User id from token in cookie is:", userId)
        const responseData = await Project.remove(projectId, userId);
        if (responseData.message) {
            response.status(404).send(responseData);
        } else {
            response.status(200).send(responseData);
        }
    } catch (err) {
        response.status(500).send({ message: err.message || "Some error occurred while reading the data" });
    }
};
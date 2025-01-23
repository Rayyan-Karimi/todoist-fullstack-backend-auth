import Project from '../models/projects.model.js';
import { isFavoriteProjectSchema, projectSchema } from '../validation/projects.js';

export const createProject = async (request, response) => {
    try {
        const validatedProject = await projectSchema.validate(request.body, { abortEarly: false });
        const userId = request.userId;
        const project = new Project(
            validatedProject.name,
            validatedProject.color || 'white',
            validatedProject.isFavorite || 0,
            userId
        )
        const responseData = await Project.create(project);
        response.status(201).send(responseData)
    } catch (err) {
        if (err.name === "ValidationError") {
            const errors = err.inner.map((e) => ({
                field: e.path,
                message: e.message,
            }));
            response.status(400).send({ errors });
        } else {
            console.error("Error during CREATE PROJECT:", err)
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
        const projectId = request.params.id;
        const validatedProject = await projectSchema.validate(request.body, { abortEarly: false });
        const userId = request.userId;
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
            console.error("Error during UPDATE PROJECT:", err)
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
        const projectId = request.params.id;
        const validatedProject = await isFavoriteProjectSchema.validate(request.body, { abortEarly: false });
        const userId = request.userId;
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
        const projectId = request.params.id;
        const userId = request.userId;
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
import Project from '../models/projects.model.js';
import { isFavoriteProjectSchema, projectSchema } from '../validation/projects.js';

export const createProject = async (request, response) => {
    try {
        const validatedProject = await projectSchema.validate(request.body, { abortEarly: false });
        const project = new Project(
            validatedProject.name,
            validatedProject.color,
            validatedProject.is_favorite || 0,
            validatedProject.user_id
        )
        const responseData = await Project.create(project);
        response.status(201).send({ message: "Project creation success.", addition: responseData })
    } catch (err) {
        if (err.name === "ValidationError") {
            return response.status(400).send({
                message: "Validation failed",
                errors: err.errors, // Array of validation errors
            });
        } else {
            console.error("Error creating project:", err);
            return response.status(500).send({
                message: "Some error occurred while creating the project.",
                error: err.message,
            });
        } // End of error handling
    }
};

export const read = async (request, response) => {
    try {
        const projectId = request.params.id;
        const responseData = await Project.findAll(projectId);
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
        const updatedProject = new Project(
            validatedProject.name,
            validatedProject.color,
            validatedProject.is_favorite || 0,
            validatedProject.user_id
        )
        const responseData = await Project.update(projectId, updatedProject);
        response.status(200).send(responseData)
    } catch (err) {
        if (err.name === "ValidationError") {
            return response.status(400).send({
                message: "Validation failed",
                errors: err.errors, // Array of validation errors
            });
        } else {
            console.error("Error creating project:", err);
            return response.status(500).send({
                message: "Some error occurred while creating the project.",
                error: err.message,
            });
        } // End of error handling
    }
};

export const updateFavoriteInProject = async (request, response) => {
    try {
        const projectId = request.params.id;
        const validatedIsFavoriteInProject = await isFavoriteProjectSchema.validate(request.body, { abortEarly: false });
        const newIsFavorite = validatedIsFavoriteInProject.is_favorite;
        console.log("Updating the project favorite status.", projectId)
        console.log("New is_favorite status is:", newIsFavorite)
        const responseData = await Project.updateFavorite(projectId, newIsFavorite);
        response.status(200).send(responseData)
    } catch (err) {
        if (err.name === "ValidationError") {
            return response.status(400).send({
                message: "Validation failed",
                errors: err.errors, // Array of validation errors
            });
        } else {
            console.error("Error creating project:", err);
            return response.status(500).send({
                message: "Some error occurred while creating the project.",
                error: err.message,
            });
        } // End of error handling
    }
};

export const updateProjectIsFavorite = async (request, response) => {
    try {
        const projectId = request.params.id;
        const validatedProject = await projectSchema.validate(request.body, { abortEarly: false });
        const newIsFavorite = validatedProject.is_favorite;
        const newName = validatedProject.name, newColor = validatedProject.color, newUserId = validatedProject.user_id;
        if (projectId && newName && newColor && newUserId) {
            const updatedProject = new Project(
                newName,
                newColor,
                newIsFavorite || 0,
                newUserId
            )
            const responseData = await Project.update(projectId, updatedProject);
            response.status(200).send(responseData)
        } else if (projectId && (newIsFavorite === 0 || newIsFavorite === 1)) {
            console.log("Updating the project favorite status.", projectId)
            console.log("New is_favorite status is:", newIsFavorite)
            const responseData = await Project.updateFavorite(projectId, newIsFavorite);
            response.status(200).send(responseData)
        } else {
            return response.status(500).send({ message: "Request body is not well defined - Some error occurred while update." })
        }
    } catch (err) {
        return response.status(500).send({ message: err.message || "Some error occurred while update of project." })
    }
};

export const deleteProject = async (request, response) => {
    try {
        const projectId = request.params.id;
        const responseData = await Project.remove(projectId);
        if (responseData.message) {
            response.status(404).send(responseData);
        } else {
            response.status(200).send(responseData);
        }
    } catch (err) {
        response.status(500).send({ message: err.message || "Some error occurred while reading the data" });
    }
};
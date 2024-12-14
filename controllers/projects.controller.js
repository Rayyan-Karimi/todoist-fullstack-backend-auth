import Project from '../models/projects.model.js';

export const createProject = async (request, response) => {
    try {
        const task = new Project(
            request.body.name,
            request.body.color,
            request.body.is_favorite || 0,
            request.body.user_id
        )
        const responseData = await Project.create(task);
        response.send({ message: "Creation success.", addition: responseData })
    } catch (err) {
        return response.status(500).send({ message: err.message || "Some error occurred while creating the Task." })
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
        if (!request.body) {
            console.error("Request cannot be empty")
            return response.status(400).send({ message: "Request cannot be empty" })
        }
        const projectId = request.params.id;
        const newIsFavorite = request.body.is_favorite;
        const newName = request.body.name, newColor = request.body.color, newUser = request.body.user_id;
        console.log("projectId", projectId, "&& !newName", newName, "&& !newColor", newColor, "&& newIsFavorite", newIsFavorite)
        if (projectId && newName && newColor && newUser && newIsFavorite) {
            const updatedProject = new Project(
                newName,
                newColor,
                newIsFavorite || 0,
                newUser
            )
            const responseData = await Project.update(projectId, updatedProject);
            responses.status(200).send(responseData)
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
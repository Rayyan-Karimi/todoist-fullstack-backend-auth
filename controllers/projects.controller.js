import Project from '../models/projects.model.js';

export const createProject = (request, response) => {
    if (!request.body) {
        console.error("Request cannot be empty")
        return response.status(400).send({ message: "Request cannot be empty" })
    }
    const project = new Project(
        request.body.name,
        request.body.color,
        request.body.is_favorite || 0,
        request.body.user_id
    )

    Project.create(project, (err, responseData) => {
        if (err) {
            return response.status(500).send({ message: err.message || "Some error occurred while creating the project." })
        }
        response.send(responseData)
    })
};

export const read = (request, response) => {
    const projectId = request.params.id;
    Project.findAll(projectId, (err, responseData) => {
        if (err) {
            response.status(500).send({ message: err.message || "Some error occurred while reading the project(s)" })
        } else if (responseData.length) {
            response.send(responseData)
        } else {
            response.send({ message: projectId? `No project found with ID = ${projectId}`:"No projects found." })
        }
    })
};

export const updateProject = (request, response) => {
    if (!request.body) {
        console.error("Request cannot be empty")
        return response.status(400).send({ message: "Request cannot be empty" })
    }
    const projectId = request.params.id;
    const newIsFavorite = request.body.is_favorite;
    const newName = request.body.name, newColor = request.body.color, newUser = request.body.user_id;
    console.log("projectId", projectId, "&& !newName", newName, "&& !newColor", newColor, "&& newIsFavorite", newIsFavorite)
    if(projectId && newName && newColor && newUser && newIsFavorite) {
        const updatedProject = new Project(
            newName,
            newColor,
            newIsFavorite || 0,
            newUser
        )
        Project.update(projectId, updatedProject, (err, responseData) => {
            if (err) {
                return response.status(500).send({ message: err.message || "Some error occurred while update of project." })
            }
            response.send(responseData)
        })
    } else if(projectId && (newIsFavorite === 0 || newIsFavorite === 1)) {
        console.log("Updating the project favorite status.", projectId)
        console.log("New is_favorite status is:", newIsFavorite)
        Project.updateFavorite(projectId, newIsFavorite, (err, responseData) => {
            if (err) {
                return response.status(500).send({ message: err.message || "Some error occurred while update of project." })
            }
            response.send(responseData)
        })
    } else {
        return response.status(500).send({ message: "Request body is not well defined - Some error occurred while update." })
    }
    
};

export const deleteProject = (request, response) => {
    const projectId = request.params.id;
    Project.remove(projectId, (err, responseData) => {
        if (err) {
            return response.status(500).send({ message: err.message || "Some error occurred while attempting delete of project." })
        }
        response.send(responseData)
    })
};
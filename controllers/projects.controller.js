import Project from '../models/projects.model.js';

export const createProject = (request, response) => {
    if (!request.body) {
        console.error("Request cannot be empty")
        return response.status(400).send({ message: "Request cannot be empty" })
    }
    const project = new Project(
        request.body.name,
        request.body.color,
        request.body.is_favorite || 0
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
    const updatedProject = new Project(
        request.body.name,
        request.body.color,
        request.body.is_favorite || 0
    )
    const projectId = request.params.id;
    Project.update(projectId, updatedProject, (err, responseData) => {
        if (err) {
            return response.status(500).send({ message: err.message || "Some error occurred while update of project." })
        }
        response.send(responseData)
    })
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
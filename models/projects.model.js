import { db } from '../db/dbConfig.js';

class Project {
    constructor(name, color, isFavorite, userId) {
        this.name = name;
        this.color = color;
        this.isFavorite = isFavorite;
        this.userId = userId;
    }

    static create(newProject, response) {
        const query = `
        insert into projects (name, color, is_favorite, user_id)
        values(?, ?, ?, ?)
        `
        const params = [newProject.name, newProject.color, newProject.isFavorite, newProject.userId]
        db.run(query, params, function (err) {
            if (err) {
                console.error("Error creating new Project", err.message)
                response(err, null);
            } else {
                console.log("Created new project", { id: this.lastID, ...newProject })
                response(null, { id: this.lastID, ...newProject })
            }
        })
    }

    static findAll(projectId, response) {
        let query = "Select * from projects"
        if (projectId) query += ` where id = ${projectId}`
        db.all(query, (err, rows) => {
            if (err) {
                const errorMessage = projectId ? `Error retrieving project with ID ${projectId}...`
                    : "Error retrieving all projects...";
                console.error(errorMessage, err.message)
                response(err, null);
            } else {
                const successMessage = projectId ? `Project with ID ${projectId} retrieved successfully!`
                    : (rows === 0? "No projects in database" :"All projects retrieved successfully!");
                console.error(successMessage)
                response(null, rows);
            }
        })
    }

    static update(projectId, updatedProject, response) {
        const query = `
        Update projects
        set name = ?, color= ?, is_favorite = ?, user_id = ?
        where id = ?
        `
        const params = [updatedProject.name, updatedProject.color, updatedProject.isFavorite,updatedProject.userId, projectId]
        db.run(query, params, function (err) {
            if (err) {
                console.error("Error updating the Project with project id =", projectId, err.message)
                response(err, null);
            } else if (this.changes === 0) {
                console.log("No project found with id=", projectId)
                response({ message: `No project found with id=${projectId}` }, null)
            } else {
                console.log("Updated project with id=", projectId, updatedProject)
                response(null, { id: projectId, ...updatedProject })
            }
        })
    }

    static updateFavorite(projectId, newIsFavorite, response) {
        const query = `
        Update projects
        set is_favorite = ?
        where id = ?
        `
        const params = [newIsFavorite, projectId]
        db.run(query, params, function (err) {
            if (err) {
                console.error("Error updating the Project with project id =", projectId, err.message)
                response(err, null);
            } else if (this.changes === 0) {
                console.log("No project found with id=", projectId)
                response({ message: `No project found with id=${projectId}` }, null)
            } else {
                console.log("Updated project with id=", projectId)
                response(null, { id: projectId })
            }
        })
    }

    static remove(projectId, response) {
        let query = "Delete from projects"
        if (projectId) query += ` where id = ${projectId}`
        db.run(query, function (err) {
            if (err) {
                console.error(`Error deleting project(s):`, err.message);
                response(err, null);
            } else if (projectId && this.changes === 0) {
                console.log(`Delete request- No project found with ID ${projectId}`);
                response({ message: `Delete request- No project found with the given ID - ${projectId}` }, null);
            } else {
                const message = projectId? `Deleted project ID with ID = ${projectId}`: "All projects deleted successfully!";
                response(null, { message: message });
                console.log(message);
            }
        })
    }
}

export default Project;
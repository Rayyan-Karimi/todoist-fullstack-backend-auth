import { db } from '../db/db.config.js';

class Project {
    constructor(name, color, isFavorite, userId) {
    // constructor(name, color, isFavorite) {
        this.name = name;
        this.color = color;
        this.isFavorite = isFavorite;
        this.userId = userId;
    }

    static create(newProject) {
        return new Promise((resolve, reject) => {
            const query = ` insert into projects (name, color, isFavorite, userId) values(?, ?, ?, ?) `
            // const query = ` insert into projects (name, color, isFavorite) values(?, ?, ?) `
            const params = [newProject.name, newProject.color, newProject.isFavorite, newProject.userId]
            db.run(query, params, function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, ...newProject })
            })
        })
    }

    static findAll(projectId, userId) {
        return new Promise((resolve, reject) => {
            let query = `Select * from projects where userId = ${userId}`
            if (projectId) query += ` and id = ${projectId}`
            db.all(query, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            })
        })
    }

    static update(projectId, updatedProject) {
        return new Promise((resolve, reject) => {
            // const query = `update projects set name = ?, color=?, isFavorite = ? where id = ?`
            const query = `update projects set name = ?, color=?, isFavorite = ?, userId = ? where id = ?` // @TODO:
            // const params = [updatedProject.name, updatedProject.color || 'white', updatedProject.isFavorite, projectId]
            const params = [updatedProject.name, updatedProject.color || 'white', updatedProject.isFavorite, updatedProject.userId, projectId]
            console.log(params)
            db.run(query, params, function (err) {
                if (err) reject(err);
                else resolve({ id: projectId, ...updatedProject })
            })
        })
    }

    static updateFavorite(projectId, newIsFavorite, response) {
        return new Promise((resolve, reject) => {
            const query = `update projects set isFavorite = ? where id = ?`
            // const query = `update projects set isFavorite = ?, userId = ? where id = ?`
            const params = [newIsFavorite, projectId] // @TODO: userId
            db.run(query, params, function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, isFavorite: newIsFavorite })
            })
        })
    }

    static remove(projectId) {
        return new Promise((resolve, reject) => {
            let query = `Delete from projects where id = ${projectId}` // @TODO:
            db.run(query, function (err) {
                if (err) reject(err);
                else if (projectId && this.changes === 0) {
                    resolve({ message: `Delete request- No project found with the given ID - ${projectId}` });
                } else {
                    const successMessage = projectId ? `Deleted project ID with ID = ${projectId}` : "All projects deleted successfully!";
                    resolve({ successMessage: successMessage });
                }
            })
        })
    }
}

export default Project;
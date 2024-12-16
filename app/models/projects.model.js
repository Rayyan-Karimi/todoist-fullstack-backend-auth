import { db } from '../db/db.config.js';

class Project {
    constructor(name, color, isFavorite, userId) {
        this.name = name;
        this.color = color;
        this.isFavorite = isFavorite;
        this.userId = userId;
    }

    static create(newProject) {
        return new Promise((resolve, reject) => {
            const query = `
                insert into projects (name, color, is_favorite, user_id)
                values(?, ?, ?, ?)
            `
            const params = [newProject.name, newProject.color, newProject.isFavorite, newProject.userId]
            db.run(query, params, function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, ...newProject })
            })
        })
    }

    static findAll(projectId) {
        return new Promise((resolve, reject) => {
            let query = "Select * from projects"
            if (projectId) query += ` where id = ${projectId}`
            db.all(query, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            })
        })
    }

    static update(projectId, updatedProject) {
        return new Promise((resolve, reject) => {
            const query = `update projects set name = ?, color=?, is_favorite = ?, user_id = ? where id = ?`
            const params = [updatedProject.name, updatedProject.color, updatedProject.isFavorite, updatedProject.userId, projectId]
            db.run(query, params, function (err) {
                if (err) reject(err);
                else resolve({ id: projectId, ...updatedProject })
            })
        })
    }

    static updateFavorite(projectId, newIsFavorite, response) {
        return new Promise((resolve, reject) => {
            const query = `update projects set is_favorite = ? where id = ?`
            const params = [newIsFavorite, projectId]
            db.run(query, params, function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, isFavorite: newIsFavorite })
            })
        })
    }

    static remove(projectId) {
        return new Promise((resolve, reject) => {
            let query = "Delete from projects"
            if (projectId) query += ` where id = ${projectId}`
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
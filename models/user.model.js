import { db } from '../db/db.config.js';

class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    static create(newUser) {
        return new Promise((resolve, reject) => {
            const query = `insert into users (name, email, password) values(?, ?, ?)`
            const params = [newUser.name, newUser.email, newUser.password]
            db.run(query, params, function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, ...newUser })
            })
        })
    }

    static findAll(userId) {
        return new Promise((resolve, reject) => {
            let query = "Select * from users"
            if (userId) query += ` where id = ${userId}`
            db.all(query, (err, rows) => {
                if (err) reject(err);
                else if (this.changes === 0) resolve({ message: `No user found with id=${userId}` });
                else resolve(rows);
            })
        });
    }

    static update(userId, updatedUser) {
        return new Promise((resolve, reject) => {
            const query = `Update users set name = ?, email = ?, password = ? where id = ?`
            const params = [updatedUser.name, updatedUser.email, updatedUser.password, userId]
            db.run(query, params, function (err) {
                if (err) reject(err);
                else if (this.changes === 0) resolve({ message: `No user found with id=${userId}` });
                else resolve({ id: userId, ...updatedUser });
            })
        })
    }

    static remove(userId, response) {
        return new Promise((resolve, reject) => {
            let query = "Delete from users"
            if (userId) query += ` where id = ${userId}`
            db.run(query, function (err) {
                if (err) reject(err);
                else if (userId && this.changes === 0) resolve({ message: userId ? `Delete request- No user found with the given ID - ${userId}` : `No entries to delete in users table` }, null);
                else {
                    const successMessage = userId ? `Deleted user ID with ID = ${userId}` : "All users deleted successfully!";
                    response(null, { message: successMessage });
                }
            })
        })
    }
}

export default User;
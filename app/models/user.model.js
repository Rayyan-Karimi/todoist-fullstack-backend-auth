import bcrypt from 'bcrypt';
import { db } from '../db/db.config.js';

class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password; // plain text password must be hashed before saving
    }

    static async create(newUser) {
        return new Promise(async (resolve, reject) => {

            const query = `insert into users (name, email, password) values(?, ?, ?)`
            // Send the hashed pass
            const params = [newUser.name, newUser.email, newUser.password]
            db.run(query, params, function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, ...newUser })
            })
        })
    }

    static findAll(userId) {
        return new Promise((resolve, reject) => {
            // Remove the pass from the details seen.
            let query = "Select * from users"
            if (userId) query += ` where id = ${userId}`
            db.all(query, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            })
        })
    }

    static findByEmail(email) {
        return new Promise((resolve, reject) => {
            // Remove the pass from the details seen.
            const query = `Select * from users where email = '${email}'`;
            db.get(query, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            })
        })
    }

    static update(userId, userObject) {
        return new Promise((resolve, reject) => {
            let query = `UPDATE USERS SET`;
            const params = [];
            let updateParams = [];

            if (userObject.newName) {
                updateParams.push(' name = ?');
                params.push(userObject.newName);
            }

            if (userObject.newPassword) {
                updateParams.push(' password = ?');
                params.push(userObject.newPassword);
            }

            if (params.length > 0) {
                query += updateParams.join(', ');
                query += ` where id = ?`;
                params.push(userId);
            } else {
                reject("You did not send valid parameter names for changing.Please use 'newName' or 'newPassword'");
            }

            db.run(query, params, function (err) {
                if (err) {
                    reject(err)
                } else if (this.changes === 0) {
                    reject(`No user found with id=${userId}`);
                } else {
                    resolve({ id: userId, successMessage: `Updated entries for id=${userId}` });
                }
            })
        })
    }

    static remove(userId) {
        return new Promise((resolve, reject) => {
            let query = "Delete from users"
            if (userId) query += ` where id = ${userId}`
            db.run(query, function (err) {
                if (err) {
                    reject(err);
                } else if (userId && this.changes === 0) {
                    const noChangeMessage = userId ? `Delete request- No user found with the given ID - ${userId}` : `No entries to delete in users table`;
                    resolve({ message: noChangeMessage });
                } else {
                    const successMessage = userId ? `Deleted user ID with ID = ${userId}` : "All users deleted successfully!";
                    resolve({ message: successMessage });
                }
            })
        })
    }
}

export default User;
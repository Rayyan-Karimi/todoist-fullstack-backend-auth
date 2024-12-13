import { db } from '../db/db.config.js';

class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    static create(newUser, response) {
        const query = `
        insert into users (name, email, password)
        values(?, ?, ?)
        `
        const params = [newUser.name, newUser.email, newUser.password]
        db.run(query, params, function (err) {
            if (err) {
                console.error("Error creating new User", err.message)
                response(err, null);
            } else {
                console.log("Created new user", { id: this.lastID, ...newUser })
                response(null, { id: this.lastID, ...newUser })
            }
        })
    }

    static findAll(userId, response) {
        let query = "Select * from users"
        if (userId) query += ` where id = ${userId}`
        db.all(query, (err, rows) => {
            if (err) {
                const errorMessage = userId ? `Error retrieving user with ID ${userId}...`
                    : "Error retrieving all projects...";
                console.error(errorMessage, err.message)
                response(err, null);
            } else {
                const successMessage = userId ? `User with ID ${userId} retrieved successfully!`
                    : (rows === 0? "No users in database" : "All users retrieved successfully!");
                console.error(successMessage)
                response(null, rows);
            }
        })
    }

    static update(userId, updatedUser, response) {
        const query = `
        Update users
        set name = ?, email= ?, password = ?
        where id = ?
        `
        const params = [updatedUser.name, updatedUser.email, updatedUser.password, userId]
        db.run(query, params, function (err) {
            if (err) {
                console.error("Error updating the User with user id =", userId, err.message)
                response(err, null);
            } else if (this.changes === 0) {
                console.log("No user found with id=", userId)
                response({ message: `No user found with id=${userId}` }, null)
            } else {
                console.log("Updated user with id=", userId, updatedUser)
                response(null, { id: userId, ...updatedUser })
            }
        })
    }

    static remove(userId, response) {
        let query = "Delete from users"
        if (userId) query += ` where id = ${userId}`
        db.run(query, function (err) {
            if (err) {
                console.error(`Error deleting user(s):`, err.message);
                response(err, null);
            } else if (userId && this.changes === 0) {
                console.log(`Delete request- No user found with ID ${userId}`);
                response({ message: `Delete request- No user found with the given ID - ${userId}` }, null);
            } else {
                const message = userId? `Deleted user ID with ID = ${userId}`: "All users deleted successfully!";
                response(null, { message: message });
                console.log(message);
            }
        })
    }
}

export default User;
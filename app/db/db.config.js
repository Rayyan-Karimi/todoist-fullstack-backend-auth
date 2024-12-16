import path from 'path';
import sqlite3 from 'sqlite3';

const dbPath = path.resolve("./app/testdb.sqlite");
const sqlite3Verbose = sqlite3.verbose();

export const db = new sqlite3Verbose.Database(dbPath, sqlite3Verbose.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("Error connecting to db", err.message);
    } else {
        console.log("Connected to db for table creations.");
    }
});

// Create the tables
export const createTables = () => {
    db.run('PRAGMA foreign_keys = ON', (err) => {
        if (err) {
            console.error("Failed to enable foreign keys:", err.message);
        } else {
            console.log("Foreign key support enabled.");
        }
    });

    const usersTable = `
    CREATE TABLE if not exists users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT not null
    )
    `;

    const projectsTable = `
    CREATE TABLE if not exists projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL, 
        color TEXT NOT NULL,
        is_favorite INTEGER DEFAULT 0,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    `;

    const tasksTable = `
    CREATE TABLE if not exists tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        content TEXT NOT NULL,
        description TEXT NOT NULL, 
        due_date TEXT NOT NULL,
        is_completed INTEGER DEFAULT 0,
        project_id INTEGER NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
    `;

    const commentsTable = `
    CREATE TABLE if not exists comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        content TEXT NOT NULL,
        posted_at TEXT DEFAULT CURRENT_TIMESTAMP,
        user_id INTEGER NOT NULL,
        project_id INTEGER NOT NULL,
        task_id INTEGER,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    `;

    db.run(usersTable, (err) => {
        if (err) console.error("Error creating users table:", err.message);
        else console.log("Created users table.");
    });
    db.run(projectsTable, (err) => {
        if (err) console.error("Error creating projects table:", err.message);
        else console.log("Created projects table.");
    });
    db.run(tasksTable, (err) => {
        if (err) console.error("Error creating tasks table:", err.message);
        else console.log("Created tasks table.");
    });
    db.run(commentsTable, (err) => {
        if (err) console.error("Error creating comments table:", err.message);
        else console.log("Created comments table.");
    });
};

import path from 'path';
import sqlite3 from 'sqlite3';
const dbPath = path.resolve("./testdb.db");
const sqlite3Verbose = sqlite3.verbose();

export const db = new sqlite3Verbose.Database(dbPath, sqlite3Verbose.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("Error connecting to db", err.message)
    } else {
        console.log("Connected to db for table creations.")
    }
})

// Create the tables
export const createTables = () => {
    db.run('PRAGMA foreign_keys = ON'); // Explicitly allow foreign key usage.

    const projectsTable = `
    create table projects (
    id integer primary key autoincrement,
    name text not null, 
    color text not null,
    is_favorite integer default 0);
    `
    const tasksTable = `
    create table tasks (
    id integer primary key autoincrement, 
    content text not null,
    description text not null, 
    due_date text not null,
    is_completed integer default 0,
    project_id integer not null,
    created_at text default current_timestamp,
    foreign key (project_id) references projects(id) ON DELETE CASCADE)
    `

    db.run(projectsTable, (err) => {
        if (err) console.error("Error creating projects table", err.message);
        else console.log("Created projects table.")
    })
    db.run(tasksTable, (err) => {
        if (err) console.error("Error creating tasks table", err.message);
        else console.log("Created tasks table.")
    })
}
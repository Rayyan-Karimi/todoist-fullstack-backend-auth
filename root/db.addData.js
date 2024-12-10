import generateProjects from '../db/projects.config.js';
import generateTodos from '../db/tasks.config.js';
import { db } from '../db/dbConfig.js'; // Assuming dbConfig.js contains the sqlite database connection
import { performance } from 'perf_hooks'; // For measuring execution time

const BATCH_SIZE = 1000; // Number of records to insert per batch

// Helper function to insert data in batches
const insertBatch = (tableName, columns, data) => {
    const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES ${data.map(() => `(?, ?, ?, ?)`).join(', ')}`;
    const flattenedData = data.flat();
    return new Promise((resolve, reject) => {
        db.run(query, flattenedData, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

// Insert projects into the database
const insertProjects = async (numProjects) => {
    console.log('Inserting projects...');
    const start = performance.now();

    for (let i = 0; i < numProjects; i += BATCH_SIZE) {
        const batch = generateProjects(Math.min(BATCH_SIZE, numProjects - i));
        const data = batch.map(project => [
            project.name,
            project.color,
            project.is_favorite
        ]);
        try {
            await insertBatch('projects', ['name', 'color', 'is_favorite'], data);
            console.log(`Inserted ${i + BATCH_SIZE} projects...`);
        } catch (err) {
            console.error('Error inserting projects:', err);
        }
    }

    const end = performance.now();
    console.log(`Projects inserted in ${(end - start) / 1000} seconds.`);
};

// Insert todos into the database
const insertTodos = async (numTodos, maxProjects) => {
    console.log('Inserting todos...');
    const start = performance.now();

    for (let i = 0; i < numTodos; i += BATCH_SIZE) {
        const batch = generateTodos(Math.min(BATCH_SIZE, numTodos - i), maxProjects);
        const data = batch.map(todo => [
            todo.content,
            todo.description,
            todo.due_date,
            todo.is_completed,
            todo.project_id
        ]);
        try {
            await insertBatch('todos', ['content', 'description', 'due_date', 'is_completed', 'project_id'], data);
            console.log(`Inserted ${i + BATCH_SIZE} todos...`);
        } catch (err) {
            console.error('Error inserting todos:', err);
            console.error('Error inserting todos:', err);
            console.error('Error inserting todos:', err);
            console.error('Error inserting todos:', err);
            console.error('Error inserting todos:', err);
        }
    }

    const end = performance.now();
    console.log(`Todos inserted in ${(end - start) / 1000} seconds.`);
};

// Main function to generate and insert data
const main = async () => {
    const numProjects = 1000000; // 1 million projects
    const numTodos = 10000000;  // 10 million todos

    try {
        await insertProjects(numProjects); // Insert projects first
        await insertTodos(numTodos, numProjects); // Then insert todos
    } catch (err) {
        console.error('Error in data insertion:', err);
    }
};

// Start the insertion process
main();

import { performance } from 'perf_hooks';
import generateComments from '../db/tools/comments.js';
import generateProjects from '../db/tools/projects.js';
import generateTasks from '../db/tools/tasks.js';
import generateUsers from '../db/tools/users.js';
import { db } from '../db/db.config.js';
const BATCH_SIZE = 1000;

class AddData {
    constructor(numberOfProjects, numberOfTasks, numberOfUsers) {
        this.numberOfUsers = numberOfUsers;
        this.numberOfProjects = numberOfProjects;
        this.numberOfTasks = numberOfTasks;
    }

    static generateFakeData = (numberOfProjects, numberOfTasks, numberOfUsers) => {
        console.log('model function called:', numberOfProjects, numberOfTasks, numberOfUsers)
        return new Promise(async (resolve, reject) => {
            try {
                await addData(numberOfProjects, numberOfTasks, numberOfUsers);
                resolve("Fake data added to DB.");
            } catch (err) {
                reject(err); // Reject the promise on error
            }
        });
    }

}

export default AddData;

const addData = async (numberOfProjects, numberOfTasks, numberOfUsers) => {
        try {
            await insertUsers(numberOfUsers)
            console.log(`${numberOfUsers} Users insertion time: ${usersTime} seconds`);
            await insertProjects(numberOfProjects, numberOfUsers)
            console.log(`${numberOfProjects} Projects insertion time: ${projectsTime} seconds`);
            await insertTasks(numberOfTasks, numberOfProjects)
            console.log(`${numberOfTasks} Tasks insertion time: ${tasksTime} seconds`);
            console.log("added data and inserted data.");
        } catch (err) {
            console.log(err);
            throw err;
        }
}

// Helper function to insert data in batches
const insertBatch = async (tableName, columns, data) => {
    const placeholders = `(${columns.map(() => '?').join(", ")})`;
    const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES ${data.map(() => placeholders).join(', ')}`;
    const flattenedData = data.flat();

    return new Promise((resolve, reject) => {
        db.run(query, flattenedData, (err) => {
            if (err) {
                console.error(`Error inserting into ${tableName}:`, err);
                reject(err);
            } else {
                console.log(`Inserted ${data.length} rows into ${tableName}.`);
                resolve();
            }
        });
    });
};

// Insert tasks
let tasksTime = 0
const insertTasks = async (numberOfTasks, maxProjects) => {
    console.log('Inserting tasks...')
    const start = performance.now()
    for (let i = 0; i < numberOfTasks; i += BATCH_SIZE) {
        const batch = generateTasks(Math.min(BATCH_SIZE, numberOfTasks - i), maxProjects) // don’t generate more records than needed in the last batch.
        const data = batch.map(task => [
            task.content,
            task.description,
            task.due_date,
            task.is_completed,
            task.project_id
        ]);
        try {
            await insertBatch('tasks', ['content', 'description', 'dueDate', 'isCompleted', 'projectId'], data);
            console.log('all tasks inserted.')
        } catch (err) {
            console.error(`Error inserting tasks in batch ${i} to ${i + BATCH_SIZE}: ${err}`);
        }
    }
    const end = performance.now()
    tasksTime = (end - start) / 1000;
}

let projectsTime = 0
// Insert projects into DB
const insertProjects = async (numberOfProjects, maxUsers) => {
    console.log("Inserting projects...")
    const start = performance.now();
    for (let i = 0; i < numberOfProjects; i += BATCH_SIZE) {
        const batch = generateProjects(Math.min(BATCH_SIZE, numberOfProjects - i), maxUsers); // don’t generate more records than needed in the last batch.
        const data = batch.map(project => [
            project.name, project.color, project.isFavorite, project.userId
            // project.name, project.color, project.isFavorite
        ]);
        try {
            await insertBatch('projects', ['name', 'color', 'isFavorite', 'userId'], data);
            console.log('all projects inserted.')
        } catch (err) {
            console.error(`Error inserting projects: ${err}`)
        }
    }
    const end = performance.now()
    projectsTime = (end - start) / 1000
}

let commentsTime = 0
// Insert projects into DB
const insertComments = async (numberOfComments, numberOfProjects, numberOfTasks, numberOfUsers) => {
    console.log("Inserting comments...")
    const start = performance.now();
    for (let i = 0; i < numberOfProjects; i += BATCH_SIZE) {
        const batch = generateComments(Math.min(BATCH_SIZE, numberOfComments - i), numberOfProjects, numberOfTasks, numberOfUsers); // don’t generate more records than needed in the last batch.
        const data = batch.map(comment => [
            comment.content, comment.projectId, comment.taskId, comment.userId
        ]);
        try {
            await insertBatch('comments', ['content', 'projectId', 'taskId', 'userId'], data);
            console.log(`Inserted ${i + BATCH_SIZE} comments...`)
        } catch (err) {
            console.error(`Error inserting comments: ${err}`)
        }
    }
    const end = performance.now()
    commentsTime = (end - start) / 1000
}

let usersTime = 0
// Insert projects into DB
const insertUsers = async (numberOfUsers) => {
    console.log("Inserting users...")
    const start = performance.now();
    for (let i = 0; i < numberOfUsers; i += BATCH_SIZE) {
        try {
            const batch = generateUsers(Math.min(BATCH_SIZE, numberOfUsers - i));
            const data = batch.map(user => [
                user.name,
                user.email,
                user.password
            ]);
            await insertBatch('users', ['name', 'email', 'password'], data);
        } catch (err) {
            console.error(`Error inserting user batch ${i} to ${i + BATCH_SIZE}:`, err);
        }
    }
    const end = performance.now()
    usersTime = (end - start) / 1000
}


import { faker } from '@faker-js/faker';

export default function generateComments(num, maxProjects, maxTasks) {
    const comments = [];
    for (let i = 1; i <= num; i++) {
        const projectId = faker.number.int({ min: 1, max: maxProjects });
        const taskId = faker.number.int({ min: 1, max: maxTasks });
        const userId = faker.number.int({ min: 1, max: 100 });
        comments.push({
            content: faker.lorem.sentence(),
            projectId: projectId,
            taskId: taskId,
            userId: userId
        });
        console.log(`Generated ${i} Comment`)
    }
    return comments;
};

export default function generateTasks(num, maxProjects) {
    const todos = [];
    for (let i = 1; i <= num; i++) {
        todos.push({
            content: faker.lorem.sentence(),
            description: faker.lorem.paragraph(),
            due_date: faker.date.future().toISOString(),
            is_completed: faker.datatype.boolean(),
            project_id: faker.number.int({ min: 1, max: maxProjects })
        });
        console.log(`Generated ${i} Task`)
    }
    return todos;
};



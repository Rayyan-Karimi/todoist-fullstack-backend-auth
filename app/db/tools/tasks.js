import { faker } from '@faker-js/faker';

export default function generateTasks(num, maxProjects) {
    const todos = [];
    for (let i = 1; i <= num; i++) {
        todos.push({
            content: faker.lorem.sentence(),
            description: faker.lorem.paragraph(),
            due_date: faker.date.future().toISOString().split('T')[0],
            is_completed: false,
            project_id: faker.number.int({ min: 1, max: maxProjects })
        });
        console.log(`Generated ${i} Task`)
    }
    return todos;
};



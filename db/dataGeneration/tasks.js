import { faker } from '@faker-js/faker';

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



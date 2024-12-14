import { faker } from '@faker-js/faker';

export default function generateComments(num, maxProjects, maxTasks, maxUsers) {
    const comments = [];
    for (let i = 1; i <= num; i++) {
        const projectId = faker.number.int({ min: 1, max: maxProjects });
        const taskId = faker.number.int({ min: 1, max: maxTasks });
        const userId = faker.number.int({ min: 1, max: maxUsers });
        if(i%3) {
            comments.push({
                content: faker.lorem.sentence(),
                projectId: projectId,
                taskId: null,
                userId: userId
            });
        } else {
            comments.push({
                content: faker.lorem.sentence(),
                projectId: projectId,
                taskId: taskId,
                userId: userId
            });
        }
        
        console.log(`Generated ${i} Comment`)
    }
    return comments;
};



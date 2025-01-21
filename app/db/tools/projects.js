import { faker } from '@faker-js/faker';

export default function generateProjects (num, maxUsers) {
    const projects = []
    for (let i=1; i<= num; i++) {
        projects.push({
            name: `Project ${i}`,
            color: faker.color.human(),
            isFavorite: faker.datatype.boolean() ? 1: 0,
            userId: faker.number.int({ min: 1, max: maxUsers })
        });
        console.log(`Generated ${i} project`);
    }
    return projects;
}

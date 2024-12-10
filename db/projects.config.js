import {faker} from '@faker-js/faker'

export default function generateProjects (num) {
    const projects = []
    for (let i=1; i<= num; i++) {
        projects.push({
            name: `Project ${i}`,
            color: faker.color.human(),
            is_favorite: faker.datatype.boolean() ? 1: 0
        });
        console.log(`Generated ${i} project`);
    }
    return projects;
}

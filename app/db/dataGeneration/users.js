import { faker } from '@faker-js/faker';

export default function generateUsers(num) {
    const users = []
    for (let i = 1; i <= num; i++) {
        users.push({
            name: `User ${i}`,
            email: faker.internet.email(),
            password: faker.internet.password()
        });
        console.log(`Generated ${i} user`);
    }
    return users;
}

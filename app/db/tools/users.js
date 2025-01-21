import { faker } from '@faker-js/faker';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';

export default function generateUsers(num) {
    const users = []
    const salt = genSaltSync(10);
    for (let i = 1; i <= num; i++) {
        const hashedPassword = hashSync('password', salt);
        users.push({
            name: `User ${i}`,
            email: faker.internet.email(),
            password: hashedPassword
            // password: faker.internet.password()
        });
        console.log(`Generated ${i} user`);
    }
    return users;
}

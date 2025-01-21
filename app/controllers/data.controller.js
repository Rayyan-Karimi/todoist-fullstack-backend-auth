import AddData from '../models/addData.js'
import { addDataSchema } from '../validation/addData.js'

export const addFakeData = async (request, response, next) => {
    try {
        console.log('controller function called:', request.body)
        const validatedAddData = await addDataSchema.validate(request.body, { abortEarly: true });
        console.log('controller function called, validated:', validatedAddData)
        const { numberOfProjects, numberOfTasks, numberOfUsers } = validatedAddData;
        console.log('controller function called, validated:', numberOfProjects, numberOfTasks, numberOfUsers)
        await AddData.generateFakeData(numberOfProjects, numberOfTasks, numberOfUsers);
        console.log('response bhejo.')
        response.status(201).send('Fake data added succesfully.');
    } catch (err) {
        console.log(err);
        response.status(400).send(err);
    }
}

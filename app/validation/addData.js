import * as yup from 'yup';

export const addDataSchema = yup.object({
    numberOfProjects: yup
        .number()
        .required('Number of projects is required'),
        // .default(1),
    // .max(1000, "Number of projects must not exceed 40 characters"),
    numberOfTasks: yup
        .number()
        .required('Number of tasks is required'),
    numberOfUsers: yup
        .number()
        .required('Number of users is required'),
});


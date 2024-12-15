import * as yup from 'yup';

export const commentSchema = yup.object({
    content: yup
        .string()
        .required('Comment\'s Content is required')
        .max(255, "Project name must not exceed 255 characters"),
    user_id: yup
        .number("User ID must be a number")
        .integer("User ID must be an integer")
        .positive("User ID must be positive")
        .required("User ID is required"),
    project_id: yup
        .number()
        .integer("Project ID must be an integer")
        .positive("Project ID must be positive")
        .required("Project ID is required"),
    task_id: yup
        .number()
        .integer("Task ID must be a number")
        .positive("Task ID must be positive")
        .nullable()
});

export const contentUpdateSchema = yup.object({
    content: yup
        .string()
        .required('Comment\'s Content is required')
        .max(255, "Project name must not exceed 255 characters")
});


import * as yup from 'yup';

<<<<<<< HEAD
export const commentsSchema = yup.object({
    content: yup
        .string()
        .max(255, "Comment cannot exceed 255 characters.")
        .required("Content is required for Comment."),
    user_id: yup
        .number("Project User_ID must be a positive integer")
        .integer("Project User_ID must be a positive integer")
        .positive("Project User_ID must be a positive integer")
        .required("Project User_ID is required"),
    project_id: yup
        .number("Project ID must be a positive integer")
        .integer("Project ID must be a positive integer")
        .positive("Project ID must be a positive integer")
        .required("Project ID is required."),
    task_id: yup
        .number("Project ID must be a positive integer")
        .integer("Project ID must be a positive integer")
        .positive("Project ID must be a positive integer")
        .nullable()
});

export const contentSchema = yup.object({
    content: yup
        .string()
        .max(255, "Comment cannot exceed 255 characters.")
        .required("Content is required for updating comments.")
});
=======
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

>>>>>>> b474e371dc18d469bb1b1fffcd49fb87a1fe1366

import * as yup from 'yup';

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

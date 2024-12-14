import * as yup from "yup";

// Task validation schema
export const taskSchema = yup.object({ 
    content: yup
        .string()
        .required("Content is required")
        .trim()
        .min(3, "Content must be at least 3 characters long"),
    description: yup
        .string()
        .required("Description is required")
        .trim()
        .max(255, "Description cannot exceed 255 characters"),
    due_date: yup
        .string()
        .required("Due date is required")
        .matches(
            /^\d{4}-\d{2}-\d{2}$/,
            "Due date must be in the format YYYY-MM-DD"
        ),
    is_completed: yup
        .number()
        .integer()
        .default(0)
        .oneOf([0, 1], "is_completed must be 0 (false) or 1 (true)"),
    project_id: yup
        .number()
        .required("Project ID is required")
        .integer("Project ID must be an integer")
        .positive("Project ID must be a positive number"),
});

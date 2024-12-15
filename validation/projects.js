import * as yup from 'yup';

export const projectSchema = yup.object({
    name: yup
        .string()
        .required('Project name is required')
        .min(3, 'Project name must be at least 3 characters long')
        .max(40, "Project name must not exceed 40 characters"),
    color: yup
        .string()
<<<<<<< HEAD
        .min(3, "Color must be at least of length - 3 characters")
=======
        .min(3, "Color cant be below 3 letters")
>>>>>>> b474e371dc18d469bb1b1fffcd49fb87a1fe1366
        .required("Project color is required"),
    is_favorite: yup
        .number()
        .integer("Favorite status must be an integer")
        .oneOf([0, 1], 'Favorite status must be either 0 or 1')
        .default(0),
    user_id: yup
        .number()
        .integer("User ID must be a number")
        .positive("User ID must be positive")
        .required("User ID is required")
});

export const isFavoriteProjectSchema = yup.object({
    is_favorite: yup
        .number()
        .integer("Favorite status must be an integer")
        .oneOf([0, 1], 'Favorite status must be either 0 or 1')
        .default(0)
        .required("This is required for updating favorite status")
});
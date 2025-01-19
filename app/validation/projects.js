import * as yup from 'yup';

export const projectSchema = yup.object({
    name: yup
        .string()
        .required('Project name is required')
        .min(3, 'Project name must be at least 3 characters long')
        .max(40, "Project name must not exceed 40 characters"),
    color: yup
        .string()
        .min(3, "Color cant be below 3 letters")
        .default('white'),
    isFavorite: yup
        .boolean()
        .oneOf([true, false], 'Favorite status must be either true or false')
        .default(false),
    // userId: yup
    //     .number()
    //     .integer("User ID must be a number")
    //     .positive("User ID must be positive")
    // .required("User ID is required")
});

export const isFavoriteProjectSchema = yup.object({
    isFavorite: yup
        .boolean("Favorite status must be an integer")
        .oneOf([true, false], 'Favorite status must be either false or true')
        .required("This is required for updating favorite status")
});
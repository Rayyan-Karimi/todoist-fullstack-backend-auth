import * as yup from 'yup';

export const postUserSchema = yup.object().shape({
    name: yup
        .string()
        .required("Name is required")
        .min(3, "Name must be at least 3 characters"),
    email: yup
        .string()
        .required("Email is required")
        .min(3, "Name must be at least 3 characters").email("Invalid email"),
    password: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
});

export const putUserSchema = yup.object().shape({
    name: yup
        .string()
        .min(3, "Name must be at least 3 characters"),
    email: yup
        .string()
        .email("Invalid email format"),
    password: yup
        .string()
        .min(6, "Password must be at least 6 characters"),
}).test(
    'at-least-one-field',
    'At least one of name or password is required',
    (value) => value.name || value.password // Ensure at least one of the two is present
);
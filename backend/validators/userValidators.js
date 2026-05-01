import { body } from "express-validator";

/**
 * Validation rules for user registration.
 */
export const validateRegister = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be between 2 and 50 characters")
        .escape(),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Must be a valid email address")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
];

/**
 * Validation rules for user / admin login.
 */
export const validateLogin = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Must be a valid email address")
        .normalizeEmail(),

    body("password").notEmpty().withMessage("Password is required"),
];

/**
 * Validation rules for profile update (all fields optional).
 */
export const validateProfileUpdate = [
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be between 2 and 50 characters")
        .escape(),

    body("email")
        .optional()
        .trim()
        .isEmail()
        .withMessage("Must be a valid email address")
        .normalizeEmail(),

    body("password")
        .optional()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    body("phone").optional().trim().escape(),
    body("address").optional().trim().escape(),
    body("city").optional().trim().escape(),
    body("state").optional().trim().escape(),
    body("postalCode").optional().trim().escape(),
    body("country").optional().trim().escape(),
];

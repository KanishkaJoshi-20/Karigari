import { body, param } from "express-validator";

/**
 * Validate :id param is a valid MongoDB ObjectId.
 */
export const validateProductId = [
    param("id").isMongoId().withMessage("Invalid product ID"),
];

/**
 * Validation rules for creating a product (all required fields).
 */
export const validateCreateProduct = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Product name is required")
        .isLength({ min: 2, max: 200 })
        .withMessage("Name must be between 2 and 200 characters")
        .escape(),

    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isFloat({ min: 0 })
        .withMessage("Price must be a number ≥ 0")
        .toFloat(),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ min: 10, max: 2000 })
        .withMessage("Description must be between 10 and 2000 characters")
        .escape(),

    body("brand").trim().notEmpty().withMessage("Brand is required").escape(),

    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required")
        .escape(),

    body("countInStock")
        .notEmpty()
        .withMessage("Count in stock is required")
        .isInt({ min: 0 })
        .withMessage("Count in stock must be a non-negative integer")
        .toInt(),

    body("image").optional().trim(),
    body("rating").optional().isFloat({ min: 0, max: 5 }).withMessage("Rating must be between 0 and 5").toFloat(),
    body("numReviews").optional().isInt({ min: 0 }).withMessage("Number of reviews must be a non-negative integer").toInt(),
];

/**
 * Validation rules for updating a product (all fields optional).
 */
export const validateUpdateProduct = [
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage("Name must be between 2 and 200 characters")
        .escape(),

    body("price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Price must be a number ≥ 0")
        .toFloat(),

    body("description")
        .optional()
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage("Description must be between 10 and 2000 characters")
        .escape(),

    body("brand").optional().trim().escape(),
    body("category").optional().trim().escape(),

    body("countInStock")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Count in stock must be a non-negative integer")
        .toInt(),

    body("image").optional().trim(),
    body("rating").optional().isFloat({ min: 0, max: 5 }).withMessage("Rating must be between 0 and 5").toFloat(),
    body("numReviews").optional().isInt({ min: 0 }).withMessage("Number of reviews must be a non-negative integer").toInt(),
];

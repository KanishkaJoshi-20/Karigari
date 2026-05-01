import { validationResult } from "express-validator";

/**
 * Middleware that checks for express-validator errors.
 * If errors exist, returns a clean 400 response with field-level messages.
 * Otherwise, calls next().
 */
export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array().map((err) => ({
                field: err.path,
                message: err.msg,
            })),
        });
    }

    next();
};

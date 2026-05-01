import jwt from "jsonwebtoken";

/**
 * Generate a signed JWT for the given user ID.
 * - Uses process.env.JWT_SECRET (validated at server startup).
 * - Token expires in 7 days.
 */
const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export default generateToken;

import { ValidationError } from "../../utils/errors";

/**
 * Validates all inputs
 *
 * @param {import('joi').AnySchema} schema
 * @returns {(req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => void}
 */
export const validate = (schema) => (req, res, next) => {
    try {
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const message = error.message;

            throw new ValidationError(message);
        }

        req.body = value;
        next();

    } catch (err) {
        next(err);
    }
}

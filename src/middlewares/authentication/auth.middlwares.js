import jwt from "jsonwebtoken";
import { AuthenticationError, NotFoundError, UnauthorizedError } from "../../utils/errors";
import User from "../../models/user.model";

const jwtSecret = process.env.JWT_SECRET || 'test_secret';
const jwtAlgorithm = process.env.JWT_ALGORITHM || 'HS256';
const jwtExpiry = process.env.JWT_EXPIRY || '1d';


/**
 * Generates a JWT Token
 * (This function is not supposed to be in this
 * file, but for the benefit of using the constants
 * in the file, that was why I declared it here.)
 *
 * @param {String} userId
 * @returns {String}
 */
export const generateToken = (userId)  => {
    const payload = { userId };

    const token = jwt.sign(payload, jwtSecret, { algorithm: jwtAlgorithm, expiresIn: jwtExpiry });

    return token;
}


/**
 * JWT authenticator
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AuthenticationError('Invalid authentication method. Bearer Auth required');
        }

        const token = authHeader.split(' ')[1];

        try {

            const payload = jwt.verify(token, jwtSecret, { algorithms: [jwtAlgorithm] });

            const user = await User.findOne({ _id: payload.userId }, { password: 0 });
            if (!user) throw new NotFoundError('User');
            req.user = user;
        } catch(err) {
            console.error(err)
            throw new UnauthorizedError('Expired/Invalid Token');
        }

        next();
    } catch (err) {
        console.error(err);
        next(err);
    }
}

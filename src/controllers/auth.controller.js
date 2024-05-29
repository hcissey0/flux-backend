import { generateToken } from '../middlewares/authentication/auth.middlwares';
import User from '../models/user.model';
import Post from '../models/post.model';
import Chat from '../models/chat.model';
import { AuthenticationError, UnauthorizedError } from '../utils/errors';
import { generateHash } from '../utils/encrypters';

export default class AuthController {


    /**
     * Connects the User
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async connectUser(req, res, next) {
        try {
            const credentials = req.headers.authorization;

            if (!credentials || !credentials.startsWith('Basic ')) {
                throw new AuthenticationError('Invalid authentication method. Basic Auth required');
            }

            const [username, password] = atob(credentials.replace('Basic ', '')).split(':');

            const hashedPassword = generateHash(password);

            const user = await User.findOne({ username, password: hashedPassword }, { password: 0 });
            if (!user) throw new UnauthorizedError('Invalid credentials');

            const token = generateToken(user.id);

            return res.json({ user, token });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Gets the current User
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async getMe(req, res, next) {
        try {
            const user = req.user;

            return res.json({ user })

        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Gets the current User's Posts
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async getPosts(req, res, next) {
        try {
            const user = req.user;

            const posts = await Post.find({ _id: user.posts });

            return res.json({ posts });
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Gets the current User's Chats
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async getChats(req, res, next) {
        try {
            const user = req.user;

            const chats = await Chat.find({ _id: user.chats });

            return res.json({ chats });
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Gets the current User's followers
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async getFollowers(req, res, next) {
        try {
            const user = req.user;

            const followers = await User.find({ _id: user.followers }, { password: 0 });

            return res.json({ followers });
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Gets the current User's following
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async getFollowing(req, res, next) {
        try {
            const user = req.user;

            const following = await User.find({ _id: user.following }, { password: 0 });

            return res.json({ following });
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Gets the current User's saved posts
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async getSavedPosts(req, res, next) {
        try {
            const user = req.user;

            const posts = await Post.find({ _id: user.savedPosts });

            return res.json({ posts });
        } catch (err) {
            console.error(err);
            next(err);
        }
    }
}

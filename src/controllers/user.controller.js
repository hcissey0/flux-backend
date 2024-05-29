import User from "../models/user.model";
import Post from "../models/post.model";
import { BadRequestError, NotFoundError } from "../utils/errors";
import { generateHash } from "../utils/encrypters";

/**
 * The User controller
 *
 * @export
 * @class UserController
 * @typedef {UserController}
 */
export default class UserController {

    /**
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async createUser(req, res, next) {
        try {
            const {
                firstName,
                lastName,
                username,
                password,
                email
            } = req.body;

            const userAvail = await User.findOne({ username }, { password: 0 });
            if (userAvail) throw new BadRequestError('User already available');

            const hashedPassword = generateHash(password);

            const user = new User();
            user.firstName = firstName;
            user.lastName = lastName;
            user.username = username;
            user.password = hashedPassword;
            user.email = email;

            user.save();

            const ret = user.toJSON()
            ret.password = undefined;
            res.json({ user: ret });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Gets all Users
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async getAllUsers(req, res, next) {
        try {
            const users = await User.find({}, { password: 0 });

            return res.json({ users })
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Gets a User
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async getUser(req, res, next) {
        try {
            const { userId } = req.params;

            const user = await User.findOne({ _id: userId }, { password: 0 });
            if (!user) throw new NotFoundError('User');

            return res.json({ user });
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async updateUser(req, res, next) {
        try {
            const { userId } = req.params;
            const update = req.body;

            const user = await User.findOneAndUpdate(
                { _id: userId },
                update,
                { returnDocument: 'after', projection: { password: 0 } }
            );

            if (!user) throw new NotFoundError('User');

            return res.json({ user });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async deleteUser(req, res, next) {
        try {
            const { userId } = req.params;

            const user = await User.findOneAndDelete({ _id: userId }, { password: 0 });
            if (!user) throw new NotFoundError('User')

            return res.json({});
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Follows a User
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async followUser(req, res, next) {
        try {
            const cUser = req.user
            const { userId } = req.params;
            if (cUser.id === userId) throw new BadRequestError('You cannot follow yourself')

            const user = await User.findOne({ _id: userId }, { password: 0 });
            if (!user) throw new NotFoundError('User');

            const currentUser = req.user;
            let followed = false;

            if (!user.followers.includes(currentUser.id)) {
                user.followers.push(currentUser.id);
                currentUser.following.push(user.id);
                followed = true;
            } else {
                user.followers.pop(currentUser.id);
                currentUser.following.pop(currentUser.id);
            }
            currentUser.save();
            user.save();

            return res.json({ followed, user });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Get User posts
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
            const { userId } = req.params;

            const user = await User.findOne({ _id: userId }, { password: 0 });
            if (!user) throw new NotFoundError('User');

            const posts = await Post.find({ _id: user.posts });

            return res.json({ posts });
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Gets User followers
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
            const { userId } = req.params;

            const user = await User.findOne({ _id: userId }, { password: 0 });
            if (!user) throw new NotFoundError('User');

            const followers = await User.find({ _id: user.followers }, { password: 0 });

            return res.json({ followers });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Gets User followings
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
            const { userId } = req.params;

            const user = await User.findOne({ _id: userId }, { password: 0 });
            if (!user) throw new NotFoundError('User');

            const following = await User.find({ _id: user.following }, { password: 0 });

            return res.json({ following });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }
}

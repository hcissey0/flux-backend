import Comment from "../models/comment.model";
import Post from "../models/post.model";
import User from "../models/user.model";
import { BadRequestError, NotFoundError } from "../utils/errors";


/**
 * The Post controller
 *
 * @export
 * @class PostController
 * @typedef {PostController}
 */
export default class PostController {

    /**
     * Creates a Post
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async createPost(req, res, next) {
        try {
            const { text } = req.body;

            const user = req.user;

            const post = new Post();
            post.author = user;
            post.text = text;

            user.posts.push(post.id);

            post.save();
            user.save();

            return res.status(201).json({ post });
        } catch (err) {
            console.error(err);
            next(err);
        }
    }


    /**
     * Gets all Posts
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async getAllPosts(req, res, next) {
        try {
            const posts = await Post.find().sort({ createdAt: -1});
            return res.json({ posts });
        } catch (err) {
            console.error(err);
            next(err);
        }

    }

    /**
     * Gets a Post
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async getPost(req, res, next) {
        try {
            const { postId } = req.params;

            const post = await Post.findOne({ _id: postId });
            if (!post) throw new NotFoundError('Post');

            return res.json({ post });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Updates a Post
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async updatePost(req,res, next) {
        try {
            const { postId } = req.params;
            const update = req.body;
            update.edited = true;

            const post = await Post.findOneAndUpdate(
                { _id: postId },
                update,
                { returnDocument: 'after' }
            );
            if (!post) throw new NotFoundError('Post')

            return res.json({ post });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Deletes a Post
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async deletePost(req, res, next) {
        try {
            const { postId } = req.params;

            const post = await Post.findOneAndDelete({ _id: postId });
            if (!post) throw new NotFoundError('Post');

            return res.json({});

        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Likes a Post
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async likePost(req, res, next) {
        try {
            const user = req.user;
            const { postId } = req.params;

            const post = await Post.findOne({ _id: postId });
            if (!post) throw new NotFoundError('Post');

            // if user already liked, unlike, otherwise like.
            let liked = false;
            if (!post.likes.includes(user.id)) {
                post.likes.push(user.id);
                liked = true;
            } else {
                post.likes.splice(post.likes.indexOf(user.id), 1);
            }
            post.save();

            return res.json({ liked, post });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Gets Post likes
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async getLikes(req, res, next) {
        try {
            const { postId } = req.params;
            const post = await Post.findOne({ _id: postId }).populate('likes');
            if (!post) throw new NotFoundError('Post');

            const likes = post.likes;

            return res.json({ likes });
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Saves a Post
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async savePost(req, res, next) {
        try {

            const user = req.user;

            const { postId } = req.params;
            const post = await Post.findOne({ _id: postId }).populate('author');
            if (!post) throw new NotFoundError('Post');

            // if user already saved, unsave, otherwise save.
            let saved = false;
            if (!user.savedPosts.includes(post.id)) {
                post.saves.push(user.id);
                user.savedPosts.push(post.id);
                saved = true;
            } else {
                post.saves.splice(post.saves.indexOf(user.id), 1);
                user.savedPosts.splice(user.savedPosts.indexOf(post.id), 1);
            }
            user.save();
            post.save();

            return res.json({ saved, post });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Gets Post saves
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async getSaves(req, res, next) {
        try {
            const { postId }  = req.params;

            const post = await Post.findOne({ _id: postId }).populate('saves');
            if (!post) throw new NotFoundError('Post');

            const saves = post.saves;

            return res.json({ saves });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Comments on a Post
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async commentOnPost(req, res, next) {
        try {
            const user = req.user;
            const { postId } = req.params;
            const { text, reply } = req.body;

            const post = await Post.findOne({ _id: postId });
            if (!post) throw new NotFoundError('Post');

            const comment = new Comment();
            comment.author = user;
            comment.text = text;
            comment.post = post;
            comment.reply = reply || false;

            post.comments.push(comment.id);
            user.comments.push(comment.id);

            comment.save();
            post.save();
            user.save();

            return res.json({ comment });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Gets Post Comments
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async getComments(req, res, next) {
        try {
            const { postId } = req.params;

            const post = await Post.findOne({ _id: postId }).populate('comments');
            if (!post) throw new NotFoundError('Post');

            const comments = post.comments;

            return res.json({ comments });
        } catch (err) {
            console.error(err);
            next(err);
        }
    }
}

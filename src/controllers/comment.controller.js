import Comment from "../models/comment.model";
import Post from "../models/post.model";
import User from "../models/user.model";
import { NotFoundError } from "../utils/errors";


/**
 * The Comment controller
 *
 * @export
 * @class CommentController
 * @typedef {CommentController}
 */
export default class CommentController {

    /**
     * Creates a Comment
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async createComment(req, res, next) {
        try {
            const { text, postId } = req.body;

            const user = req.user;

            const post = await Post.findOne({ _id: postId});
            if (!post) throw new NotFoundError('Post')

            const comment = new Comment();
            comment.author = user;
            comment.post = post;
            comment.text = text;

            post.comments.push(comment.id);
            user.comments.push(comment.id);

            comment.save();
            post.save();
            user.save();

            return res.status(201).json({ comment });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Gets all Comments
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async getAllComments(req, res, next) {
        try {
            const comments = await Comment.find().populate('author');
            return res.json({ comments });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Gets a Comment
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async getComment(req, res, next) {
        try {
            const { commentId } = req.params;

            const comment = await Comment.findOne({ _id: commentId }).populate('author');
            if (!comment) throw new NotFoundError('Comment');

            res.json({ comment });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Updates a Comment
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async updateComment(req, res, next) {
        try {
            const { commentId } = req.params;

            const update = req.body;
            update.edited = true;

            const comment = await Comment.findOneAndUpdate(
                { _id: commentId },
                update,
                { returnDocument: 'after' }
            ).populate('author');
            if (!comment) throw new NotFoundError('Comment');

            return res.json({ comment });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Deletes a Comment
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async deleteComment(req, res, next) {
        try {
            const { commentId } = req.params;

            const comment = await Comment.findOneAndDelete({ _id: commentId }).populate('author');

            if (!comment) throw new NotFoundError('Comment');

            return res.json({});

        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Likes a Comment
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async likeComment(req, res, next) {
        try {
            const { commentId } = req.params;

            const user = req.user;

            const comment = await Comment.findOne({ _id: commentId });
            if (!comment) throw new NotFoundError('Comment');

            // if user already liked, unlike, otherwise like.
            let liked = false;
            if (!comment.likes.includes(user.id)) {
                comment.likes.push(user.id);
                liked = true;
            } else {
                comment.likes.splice(comment.likes.indexOf(user.id), 1);
            }

            comment.save();

            return res.json({ liked, comment });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Get Comment Likes
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
            const { commentId } = req.params;

            const comment = await Comment.findOne({ _id: commentId }).populate('likes');
            if (!comment) throw new NotFoundError('Comment');

            const likes = comment.likes;
            return res.json({ likes });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Reply to Comment
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async replyToComment(req, res, next) {
        try {
            const { commentId } = req.params;

            const user = req.user;

            const comment = await Comment.findOne({ _id: commentId });
            if (!comment) throw new NotFoundError('Comment');

            const reply = new Comment();
            reply.author = user;
            reply.post = comment.post;
            reply.text = req.body.text;
            reply.reply = true;

            comment.replies.push(reply.id);
            user.comments.push(reply.id);

            reply.save();
            comment.save();
            user.save();

            return res.status(201).json({ replied: true, reply });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Get Comment replies
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async getReplies(req, res, next) {
        try {
            const { commentId } = req.params;

            const comment = await Comment.findOne({ _id: commentId }).populate('replies');
            if (!comment) throw new NotFoundError('Comment');

            const replies = comment.replies;
            return res.json({ replies });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }
}

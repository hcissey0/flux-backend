import { Router } from "express";
import CommentController from "../controllers/comment.controller";
import { validate } from "../middlewares/validation/validation.middlwares";
import { commentCreateSchema, commentUpdateSchema } from "../middlewares/validation/validation.schemas";
import { authenticate } from "../middlewares/authentication/auth.middlwares";

const commentRouter = Router();

// commentRouter.post('/', authenticate, validate(commentCreateSchema), CommentController.createComment);

commentRouter.get('/', authenticate, CommentController.getAllComments);

// commentRouter.get('/:commentId', authenticate, CommentController.getComment);

commentRouter.put('/:commentId', authenticate, validate(commentUpdateSchema), CommentController.updateComment);

commentRouter.delete('/:commentId', authenticate, CommentController.deleteComment);

commentRouter.post('/:commentId/likes', authenticate, CommentController.likeComment);

commentRouter.get('/:commentId/likes', authenticate, CommentController.getLikes);

commentRouter.post('/:commentId/replies', authenticate, validate(commentCreateSchema), CommentController.replyToComment);

commentRouter.get('/:commentId/replies', authenticate, CommentController.getReplies);

export default commentRouter;

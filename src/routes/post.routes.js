import { Router } from "express";
import PostController from "../controllers/post.controller";
import { validate } from "../middlewares/validation/validation.middlwares";
import { commentCreateSchema, postCreateSchema, postUpdateSchema } from "../middlewares/validation/validation.schemas";
import { authenticate } from "../middlewares/authentication/auth.middlwares";

const postRouter = Router();

postRouter.post('/', authenticate, validate(postCreateSchema), PostController.createPost);

postRouter.get('/', authenticate, PostController.getAllPosts);

postRouter.get('/:postId', authenticate, PostController.getPost);

postRouter.put('/:postId', authenticate, validate(postUpdateSchema), PostController.updatePost);

postRouter.delete('/:postId', authenticate, PostController.deletePost);

postRouter.post('/:postId/likes', authenticate, PostController.likePost);

postRouter.get('/:postId/likes', authenticate, PostController.getLikes);

postRouter.post('/:postId/saves', authenticate, PostController.savePost);

postRouter.get('/:postId/saves', authenticate, PostController.getSaves);

postRouter.post('/:postId/comments', authenticate, validate(commentCreateSchema), PostController.commentOnPost);

postRouter.get('/:postId/comments', authenticate, PostController.getComments);

export default postRouter;

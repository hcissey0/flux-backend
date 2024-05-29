import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { authenticate } from "../middlewares/authentication/auth.middlwares";


const authRouter = Router();

authRouter.get('/connect', AuthController.connectUser)

authRouter.get('/me', authenticate, AuthController.getMe);

authRouter.get('/me/posts', authenticate, AuthController.getPosts);

authRouter.get('/me/chats', authenticate, AuthController.getChats);

authRouter.get('/me/followers', authenticate, AuthController.getFollowers);

authRouter.get('/me/following', authenticate, AuthController.getFollowing);

authRouter.get('/me/saved', authenticate, AuthController.getSavedPosts);

export default authRouter;

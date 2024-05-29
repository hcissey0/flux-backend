import { Router } from "express";
import UserController from "../controllers/user.controller";
import { validate } from "../middlewares/validation/validation.middlwares";
import { userCreateSchema, userUpdateSchema } from "../middlewares/validation/validation.schemas";
import { authenticate } from "../middlewares/authentication/auth.middlwares";

const userRouter = Router();

userRouter.post('/', validate(userCreateSchema), UserController.createUser);

userRouter.get('/', authenticate, UserController.getAllUsers);

userRouter.get('/:userId', authenticate, UserController.getUser);

userRouter.put('/:userId', authenticate, validate(userUpdateSchema), UserController.updateUser);

userRouter.delete('/:userId', authenticate, UserController.deleteUser);

userRouter.post('/:userId/follow', authenticate, UserController.followUser);

userRouter.get('/:userId/posts', authenticate, UserController.getPosts);

userRouter.get('/:userId/followers', authenticate, UserController.getFollowers);

userRouter.get('/:userId/following', authenticate, UserController.getFollowing);


export default userRouter;

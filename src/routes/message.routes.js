import { Router } from "express";
import MessageController from "../controllers/message.controller";
import { validate } from "../middlewares/validation/validation.middlwares";
import { messageCreateSchema, messageUpdateSchema } from "../middlewares/validation/validation.schemas";
import { authenticate } from "../middlewares/authentication/auth.middlwares";

const messageRouter = Router();

messageRouter.post('/', authenticate, validate(messageCreateSchema), MessageController.createMessage);

messageRouter.get('/', authenticate, MessageController.getAllMessages);

messageRouter.get('/:messageId', authenticate, MessageController.getMessage);

messageRouter.put('/:messageId', authenticate, validate(messageUpdateSchema), MessageController.updateMessage);

messageRouter.delete('/:messageId', authenticate, MessageController.deleteMessage);

export default messageRouter;

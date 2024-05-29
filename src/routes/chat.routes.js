import { Router } from "express";
import ChatController from "../controllers/chat.controller";
import { validate } from "../middlewares/validation/validation.middlwares";
import { addParticipantSchema, chatCreateSchema, chatUpdateSchema, messageCreateSchema } from "../middlewares/validation/validation.schemas";
import { authenticate } from "../middlewares/authentication/auth.middlwares";

const chatRouter = Router();

chatRouter.post('/', authenticate, validate(chatCreateSchema), ChatController.createChat);

chatRouter.get('/', authenticate, ChatController.getAllChats);

chatRouter.get('/:chatId', authenticate, ChatController.getChat);

chatRouter.put('/:chatId', authenticate, validate(chatUpdateSchema), ChatController.updateChat);

chatRouter.delete('/:chatId', authenticate, ChatController.deleteChat);

chatRouter.post('/:chatId/messages', authenticate, validate(messageCreateSchema), ChatController.addMessage);

chatRouter.get('/:chatId/messages', authenticate, ChatController.getMessages);

chatRouter.post('/:chatId/participants', authenticate, validate(addParticipantSchema), ChatController.addParticipant);

chatRouter.get('/:chatId/participants', authenticate, ChatController.getParticipants);

export default chatRouter;

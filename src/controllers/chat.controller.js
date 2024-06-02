import Chat from "../models/chat.model";
import Message from "../models/message.model";
import User from "../models/user.model";
import { BadRequestError, NotFoundError, UnauthorizedError, ValidationError } from "../utils/errors";


/**
 * The Chat controller
 *
 * @export
 * @class ChatController
 * @typedef {ChatController}
 */
export default class ChatController {


    /**
     * Creates a Chat
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async createChat(req, res, next) {
        try {
            const { name, isGroup, participantIds } = req.body;

            const user = req.user;

            const chat = new Chat();
            chat.admins.push(user.id);
            chat.isGroup = isGroup;

            user.chats.push(chat.id);
            chat.participants.push(user.id);

            if (isGroup) {
                if (!name) throw new ValidationError('"name" required for a group chat');
                chat.name = name;

            } else {
                if (participantIds.length === 0) throw new ValidationError('A participant is required for single chat');
                if (participantIds.includes(user.id)) throw new BadRequestError('Cannot create a chat with yourself');

            }
            if (participantIds) {
                const participants = await User.find({ _id: participantIds });
                if (!participants) throw new NotFoundError('Users');



                participants.forEach((part) => {
                    if (!isGroup) {
                        chat.admins.push(part.id);
                    }
                    chat.participants.push(part.id);
                    part.chats.push(chat.id);
                    part.save();
                });
                chat.name = (isGroup) ? (name) : ((participants[0].firstName) ? (participants[0].firstName) : (participants[0].username));

            }

            chat.save();
            user.save();

            return res.status(201).json({ chat });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Gets all Chats
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async getAllChats(req, res, next) {
        try {
            const chats = await Chat.find();
            return res.json({ chats });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Gets a Chat
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async getChat(req, res, next) {
        try {
            const { chatId } = req.params;

            const chat = await Chat.findOne({ _id: chatId });
            if (!chat) throw new NotFoundError('Chat');

            return res.json({ chat });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Updates a Chat
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async updateChat(req, res, next) {
        try {
            const { chatId } = req.params;

            const update = req.body;

            const chat = await Chat.findOneAndUpdate(
                { _id: chatId },
                update,
                { returnDocument: 'after' }
            );
            if (!chat) throw new NotFoundError('Chat');

            return res.json({ chat });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Deletes a Chat
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async deleteChat(req, res, next) {
        try {
            const { chatId } = req.params;

            const chat = await Chat.findOneAndDelete({ _id: chatId });
            if (!chat) throw new NotFoundError('Chat');

            return res.json({});

        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Adds a message to Chat
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async addMessage(req, res, next) {
        try {
            const user = req.user;
            const { chatId } = req.params;

            const { text } = req.body;

            const chat = await Chat.findOne({ _id: chatId });
            if (!chat) throw new NotFoundError('Chat');

            if (!chat.participants.includes(user.id)) throw new UnauthorizedError('You are not in this chat');

            const message = new Message();
            message.chat = chat;
            message.author = user;
            message.text = text;

            chat.messages.push(message.id);

            message.save();
            chat.save();

            return res.json({ message });
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Get Chat messages
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async getMessages(req, res, next) {
        try {
            const user = req.user;

            const { chatId } = req.params;
            const chat = await Chat.findOne({ _id: chatId });
            if (!chat) throw new NotFoundError('Chat');

            if (!chat.participants.includes(user.id)) throw new UnauthorizedError('You are not in this chat');

            const messages = await Message.find({ _id: chat.messages });

            return res.json({ messages });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Add participants to Chat
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async addParticipant(req, res, next) {
        try {

            const user = req.user;

            const { chatId } = req.params;

            const { username } = req.body;

            const chat = await Chat.findOne({ _id: chatId });
            if (!chat) throw new NotFoundError('Chat');

            if (!chat.isGroup) throw new BadRequestError('Chat is not a group chat');

            if (!chat.admins.includes(user.id)) throw new UnauthorizedError('You are not an admin of the chat');
            const toAdd = await User.findOne({ username });
            if (!toAdd) throw new NotFoundError('User');

            // if (chat.participants.includes(toAdd.id)) throw new BadRequestError('User already in chat');

            let added = false;
            if (!chat.participants.includes(toAdd.id)) {
                chat.participants.push(toAdd.id);
                toAdd.chats.push(chat.id);
                added = true;
            } else {
                chat.participants.pop(toAdd.id);
                chat.admins.pop(toAdd.id);
                toAdd.chats.pop(chat.id);
            }

            if (Array.isEmpty(chat.admins) && Array.isEmpty(chat.participants)) {
                await Chat.deleteOne({ _id: chat.id });
            } else {
                chat.save();
            }

            toAdd.save();

            return res.json({ added, chat });
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Gets Chat participants
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async getParticipants(req, res, next) {
        try {
            const user = req.user;

            const { chatId } = req.params;

            const chat = await Chat.findOne({ _id: chatId });
            if (!chat) throw new NotFoundError('Chat');

            if (!chat.participants.includes(user.id)) throw new UnauthorizedError('You are not in this chat');

            const participants = await User.find({ _id: chat.participants });

            return res.json({ participants });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }
}

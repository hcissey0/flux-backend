import Chat from "../models/chat.model";
import Message from "../models/message.model";
import User from "../models/user.model";


/**
 * The Message controller
 *
 * @export
 * @class MessageController
 * @typedef {MessageController}
 */
export default class MessageController {

    /**
     * Creates a Message
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async createMessage(req, res, next) {
        try {
            const { userid, chatid } = req.headers;

            if (!userid) return res.status(400).json({error:'userid not found'});
            if (!chatid) return res.status(400).json({error:'chatid not found'});

            const { text } = req.body;
            if (!text) return res.status(400).json({error:'message text not found'});

            const user = await User.findOne({ _id: userid });
            if (!user) return res.status(404).json({error:'user not found'});
            const chat = await Chat.findOne({ _id: chatid });
            if (!chat) return res.status(404).json({error:'chat not found'});

            const message = new Message();
            message.author = user;
            message.chat = chat;
            message.text = text;

            chat.messages.push(message);

            message.save();
            chat.save();
            user.save();

            return res.json({ message });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Gets all Messages
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async getAllMessages(req, res, next) {
        try {
            const messages = await Message.find();

            return res.json({ messages });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Gets a Message
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async getMessage(req, res, next) {
        try {
            const { messageId } = req.params;

            const message = await Message.findOne({ _id: messageId });
            if (!message) return res.status(404).json({error:'message not found'});

            return res.json({ message });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    /**
     * Updates a Message
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async updateMessage(req, res, next) {
        try {
            const { messageId } = req.params;

            const update = req.body;
            update.edited = true;

            const message = await Message.findOneAndUpdate(
                { _id: messageId },
                update,
                { returnDocument: 'after' }
            );
            if (!message) return res.status(404).json({error:'message not found'});

            return res.json({ message });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }


    /**
     * Deletes a Message
     *
     * @static
     * @async
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {unknown}
     */
    static async deleteMessage(req, res, next) {
        try {
            const { messageId } = req.params;

            const message = await Message.findOneAndDelete({ _id: messageId });

            if (!message) return res.status(404).json({error:'message not found'});
            return res.json({});

        } catch (err) {
            console.error(err);
            next(err);
        }

    }
}

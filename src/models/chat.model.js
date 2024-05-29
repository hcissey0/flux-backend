import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const chatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    isGroup: {
        type: Boolean,
        default: false,
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    }],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    }
}, { timestamps: true, id: true });

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;

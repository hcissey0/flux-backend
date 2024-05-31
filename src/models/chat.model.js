import mongoose from "mongoose";

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


// Pre-populating the admins, participants, messages and lastMessage field
chatSchema.pre(new RegExp('find*'), function (next) {
    if (this.options._recursed) {
        return next();
      }
      this.populate({
        path: 'admins',
        options: {
          _recursed: true
        }
      });
      next();
});

chatSchema.post('save', function () {
    this.populate('admins')
})

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;

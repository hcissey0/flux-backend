import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const messageSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference the User model (who created the comment)
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  edited: {
    type: Boolean,
    default: false,
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
  },
}, { timestamps: true, id: true });

// Pre-populating the author field
messageSchema.pre(new RegExp('find*'), function (next) {
  if (this.options._recursed) {
    return next();
  }
  this.populate({
    path: 'author',
    options: {
      _recursed: true
    }
  });
  next();
});

messageSchema.post('save', function (next) {
  this.populate('author');
})

const Message = mongoose.model('Message', messageSchema);
export default Message;

import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const commentSchema = new mongoose.Schema({
  edited: {
    type: Boolean,
    default: false
  },
  reply: {
    type: Boolean,
    default: false,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference the User model (who created the comment)
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference the User model (who liked the comment)
  }],
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
}, { timestamps: true, id: true });

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;

import mongoose, { Mongoose } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const postSchema = new mongoose.Schema({
  edited: {
    type: Boolean,
    default: false,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference the User model (who created the post)
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference the User model (who liked the post)
  }],
  saves: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference the User model (who saved the post)
  }],
}, { timestamps: true, id: true });

const Post = mongoose.model('Post', postSchema);
export default Post;

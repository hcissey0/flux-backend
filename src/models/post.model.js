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

// Pre-populating the author and comments field
postSchema.pre(new RegExp('find*'), function (next) {
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

postSchema.post('save', function () {
  this.populate('author');
});


const Post = mongoose.model('Post', postSchema);
export default Post;

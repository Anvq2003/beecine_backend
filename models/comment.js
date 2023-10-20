const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const replySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, trim: true, minLength: 3, maxLength: 255 },
    likes: { type: Array, default: [] },
    dislikes: { type: Array, default: [] },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

const commentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    content: { type: String },
    likes: { type: Array, default: [] },
    dislikes: { type: Array, default: [] },
    status: { type: Boolean, default: true },
    replies: [replySchema],
  },
  {
    timestamps: true,
  },
);

commentSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
replySchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
commentSchema.plugin(mongoosePaginate);

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;

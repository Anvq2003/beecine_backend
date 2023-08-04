const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const replySchema = new mongoose.Schema(
  {
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
    comment: { type: String, required: true },
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
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    comment: { type: String },
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

const Comment = mongoose.model('Comment', commentSchema);
const Reply = mongoose.model('Reply', replySchema);
module.exports = { Comment, Reply };

const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
  comment: { type: String, required: true },
  likes: { type: Array, default: [] },
  dislikes: { type: Array, default: [] },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const commentSchema = new mongoose.Schema({
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  comment: { type: String },
  likes: { type: Array, default: [] },
  dislikes: { type: Array, default: [] },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  replies: [replySchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model('Comment', commentSchema);
const Reply = mongoose.model('Reply', replySchema);
module.exports = { Comment, Reply };

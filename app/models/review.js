const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  replyComment: { type: String, required: true },
  replyDatePosted: { type: Date, default: Date.now },

  updatedAt: { type: Date, default: Date.now },
});

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
  datePosted: { type: Date, default: Date.now },
  replies: [replySchema],

  updatedAt: { type: Date, default: Date.now },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

const mongoose = require('mongoose');

const ratedMovieSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  rating: { type: Number, required: true },
});

const userSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  fullName: { type: String, required: true },
  subscriptionType: { type: String, default: 'free' },
  favoriteGenres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }],
  watchedMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  ratedMovies: [ratedMovieSchema],
  favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  genres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }],
  countryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  releaseDate: { type: Date, required: true },
  isSeries: { type: Boolean, default: false },
  cast: { type: [String], required: true },
  director: { type: String },
  duration: { type: Number },
  rating: { type: Number },
  trailerUrl: { type: String },
  videoUrl: { type: String },
  images: { type: [String] },
  type: { type: String, enum: ['free', 'premium'], default: 'free' },
  totalRating: { type: Number },
  totalReviews: { type: Number },
  status: { type: Boolean, default: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;

const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  season: { type: Number },
  number: { type: Number, required: true },
  duration: { type: Number },
  airDate: { type: Date, required: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Episode = mongoose.model('Episode', episodeSchema);

module.exports = Episode;

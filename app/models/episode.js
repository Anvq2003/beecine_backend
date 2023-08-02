const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  thumbnailUrl: { type: String, required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  views: { type: Number, default: 0 },
  season: { type: Number },
  number: { type: Number },
  duration: { type: Number },
  airDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Episode = mongoose.model('Episode', episodeSchema);

module.exports = Episode;

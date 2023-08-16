const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
var slug = require('mongoose-slug-updater');

const episodeSchema = new mongoose.Schema(
  {
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    imageUrl: { type: String },
    title: { type: String },
    slug: { type: String, slug: ['title', 'season', 'number'], unique: true },
    description: { type: String },
    views: { type: Number, default: 0 },
    videoUrl: { type: String, require: true },
    season: { type: Number },
    number: { type: Number },
    duration: { type: Number },
    airDate: { type: Date },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

mongoose.plugin(slug);
episodeSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
const Episode = mongoose.model('Episode', episodeSchema);

module.exports = Episode;

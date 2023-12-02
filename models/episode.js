const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
var slug = require('mongoose-slug-updater');
const mongoosePaginate = require('mongoose-paginate-v2');
const { languageSchema, imageSchema } = require('./language');

const episodeSchema = new mongoose.Schema(
  {
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    imageUrl: { type: imageSchema, required: true },
    videoUrl: { type: String, require: true },
    title: { type: languageSchema, required: true },
    slug: { type: String, slug: ['title.vi', 'season', 'number'], unique: true },
    description: { type: languageSchema },
    season: { type: Number, default: 1, min: 1, max: 1000 },
    number: { type: Number, default: 1, min: 1, max: 1000 },
    duration: { type: Number, default: 0, min: 0, max: 1000 },
    airDate: { type: Date, default: Date.now },
    views: { type: Number, default: 0 },
    languages: { type: [String], default: ['en', 'vi'] },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

mongoose.plugin(slug);
episodeSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
episodeSchema.plugin(mongoosePaginate);

const Episode = mongoose.model('Episode', episodeSchema);

module.exports = Episode;

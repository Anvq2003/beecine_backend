const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
var slug = require('mongoose-slug-updater');
const mongoosePaginate = require('mongoose-paginate-v2');

const episodeSchema = new mongoose.Schema(
  {
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    imageUrl: { type: String },
    videoUrl: { type: String, require: true },
    title: { type: String },
    slug: { type: String, slug: ['title', 'season', 'number'], unique: true },
    description: { type: String },
    season: { type: Number },
    number: { type: Number },
    duration: { type: Number },
    airDate: { type: Date },
    views: { type: Number, default: 0 },
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

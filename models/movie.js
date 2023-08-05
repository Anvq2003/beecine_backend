const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
var slug = require('mongoose-slug-updater');

const movieSchema = new mongoose.Schema(
  {
    genres: [{ type: mongoose.Schema.Types.ObjectId }],
    country: { type: String, required: true },
    cast: [{ type: mongoose.Schema.Types.ObjectId }],
    director: [{ type: mongoose.Schema.Types.ObjectId }],
    ageGroup: { type: String, default: 'all' },
    title: { type: String, required: true },
    slug: { type: String, slug: 'title', unique: true },
    description: { type: String },
    releaseDate: { type: Date, required: true },
    isSeries: { type: Boolean, default: false },
    duration: { type: Number },
    rating: { type: Number },
    thumbnailUrl: { type: String },
    trailerUrl: { type: String },
    videoUrl: { type: String },
    type: { type: String, default: 'free' },
    tags: { type: [String] },
    totalFavorites: { type: Number, default: 0 },
    totalComments: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

mongoose.plugin(slug);
movieSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;

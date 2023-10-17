const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const slug = require('mongoose-slug-updater');
const mongoosePaginate = require('mongoose-paginate-v2');

const infoSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String },
    slug: { type: String },
  },
  { _id: false },
);

const movieSchema = new mongoose.Schema(
  {
    genres: { type: [infoSchema], required: true },
    cast: { type: [infoSchema], default: null },
    directors: { type: [infoSchema], default: null },
    country: infoSchema,
    minimumAge: { type: Number, default: 0 },
    title: { type: String, required: true },
    slug: { type: String, slug: 'title', unique: true },
    description: { type: String, default: null },
    releaseDate: { type: Date, required: true },
    isSeries: { type: Boolean, default: false },
    duration: { type: Number },
    rating: { type: Number },
    imageUrl: { type: String },
    trailerUrl: { type: String },
    isFree: { type: Boolean, default: true },
    types: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' }], default: null },
    tags: { type: [String], default: null },
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
movieSchema.plugin(mongoosePaginate);
const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;

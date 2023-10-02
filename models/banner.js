const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const Banner = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    genres: { type: Array, required: true },
    cast: { type: Array, required: true },
    directors: { type: Array, required: true },
    link: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    order: { type: Number, required: true, default: 0 },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

Banner.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

module.exports = mongoose.model('Banner', Banner);

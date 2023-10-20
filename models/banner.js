const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const Banner = new mongoose.Schema(
  {
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    order: { type: Number, required: true, default: 0, min: 0, max: 1000 },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

Banner.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
Banner.plugin(mongoosePaginate);

module.exports = mongoose.model('Banner', Banner);

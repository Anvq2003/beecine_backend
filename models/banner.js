const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const Banner = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    link: { type: String, required: true },
    order: { type: Number, required: true, default: 0 },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

Banner.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

module.exports = mongoose.model('Banner', Banner);

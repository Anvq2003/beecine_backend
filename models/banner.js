const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');
const { languageSchema } = require('./language');

const Banner = new mongoose.Schema(
  {
    tag: { type: languageSchema, required: true },
    title: { type: languageSchema, required: true },
    description: { type: languageSchema, required: true },
    imageUrl: { type: String, required: true },
    link: { type: String, required: true },
    order: { type: Number, default: 0, min: 0, max: 1000 },
    status: { type: Boolean, default: true },
    languages: { type: [String], default: ['en', 'vi'] },
  },
  {
    timestamps: true,
  },
);

Banner.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
Banner.plugin(mongoosePaginate);

module.exports = mongoose.model('Banner', Banner);

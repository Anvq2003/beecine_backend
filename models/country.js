const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');
const { languageSchema, languageArraySchema } = require('./language');

const countrySchema = new mongoose.Schema(
  {
    name: { type: languageSchema, required: true },
    slug: { type: String, slug: 'name.vi', unique: true },
    order: { type: Number, default: 0, min: 0, max: 1000 },
    languages: { type: [String], default: ['en', 'vi'] },
    movieCount: { type: Number, default: 0 },
    artistCount: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

countrySchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
countrySchema.plugin(mongoosePaginate);

const Country = mongoose.model('Country', countrySchema);

module.exports = Country;

const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const slug = require('mongoose-slug-updater');
const Schema = mongoose.Schema;

const countrySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, slug: 'name', unique: true },
    code: { type: String, required: true },
    language: { type: String },
    currency: { type: String },
    telephone: { type: String },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

mongoose.plugin(slug);
countrySchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
const Country = mongoose.model('Country', countrySchema);

module.exports = Country;

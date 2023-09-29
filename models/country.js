const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const countrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, slug: 'name', unique: true },
    order: { type: Number, required: true, default: 0 },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

countrySchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

const Country = mongoose.model('Country', countrySchema);

module.exports = Country;

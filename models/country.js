const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

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
countrySchema.plugin(mongoosePaginate);

const Country = mongoose.model('Country', countrySchema);

module.exports = Country;

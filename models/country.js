const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const countrySchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    language: { type: String },
    currency: { type: String },
    telephone: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  {
    timestamps: true,
  },
);

countrySchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
const Country = mongoose.model('Country', countrySchema);

module.exports = Country;

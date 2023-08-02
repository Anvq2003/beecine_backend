const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const countrySchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  language: { type: String },
  currency: { type: String },
  telephone: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Country = mongoose.model('Country', countrySchema);

module.exports = Country;

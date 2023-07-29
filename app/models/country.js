const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const countrySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  language: { type: String },
  currency: { type: String },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Country = mongoose.model('Country', countrySchema);

module.exports = Country;

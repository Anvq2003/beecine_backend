const mongoose = require('mongoose');

const Banner = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  order: { type: Number, required: true, default: 0 },
  link: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Banner', Banner);

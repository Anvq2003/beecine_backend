const mongoose = require('mongoose');

const ageGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  minimum: { type: Number, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const AgeGroup = mongoose.model('AgeGroup', ageGroupSchema);

module.exports = AgeGroup;

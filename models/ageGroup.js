const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const ageGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    minimum: { type: Number, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  {
    timestamps: true,
  },
);

ageGroupSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

const AgeGroup = mongoose.model('AgeGroup', ageGroupSchema);

module.exports = AgeGroup;

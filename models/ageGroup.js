const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const ageGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    minimum: { type: Number, required: true },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

ageGroupSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

const AgeGroup = mongoose.model('AgeGroup', ageGroupSchema);

module.exports = AgeGroup;

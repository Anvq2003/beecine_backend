const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const subscriptionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    benefits: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

subscriptionSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;

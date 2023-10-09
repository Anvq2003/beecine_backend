const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

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
subscriptionSchema.plugin(mongoosePaginate);

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;

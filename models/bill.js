const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const billSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'active',
    },
    total: { type: Number },
    paymentMethod: { type: String },
  },
  {
    timestamps: true,
  },
);

billSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;

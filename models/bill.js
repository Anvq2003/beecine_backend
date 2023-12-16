const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const billSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
    startDate: { type: Date, default: Date.now, required: true },
    endDate: { type: Date, required: true, default: null },
    usedCoin: { type: Number, default: 0 },
    coinToMoney: { type: Number, default: 0 },
    subTotal: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, default: null },
    status: {
      type: String,
      enum: ['ACTIVE', 'EXPIRED', 'CANCELLED'],
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
  },
);

billSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
billSchema.plugin(mongoosePaginate);

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;

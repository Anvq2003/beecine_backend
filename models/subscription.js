const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');
const { languageSchema, languageArraySchema } = require('./language');

const subscriptionSchema = new mongoose.Schema(
  {
    name: { type: languageSchema, required: true },
    price: { type: Number, required: true, min: 0 },
    duration: { type: Number, required: true, min: 0 },
    benefits: { type: languageArraySchema },
    isFeatured: { type: Boolean, default: false },
    languages: { type: [String], default: ['en', 'vi'] },
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

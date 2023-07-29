const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  priceMonthly: { type: Number, required: true },
  priceYearly: { type: Number, required: true },
  benefits: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  availableCountries: [{ type: String }],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;

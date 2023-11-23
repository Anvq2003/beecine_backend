const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  code: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issuedAt: { type: Number, required: true },
  expiresAt: { type: Number, required: true },
});

const OTP = mongoose.model('Otp', otpSchema);
module.exports = OTP;

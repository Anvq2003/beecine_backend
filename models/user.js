const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const userSchema = new mongoose.Schema(
  {
    avatarUrl: { type: String, required: true },
    fullName: { type: String, required: true },
    role: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    UID: { type: String, required: true },
    points: { type: Number, default: 0 },
    subscriptionType: { type: String, default: 'free' },
    profiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

userSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
const User = mongoose.model('User', userSchema);

module.exports = User;

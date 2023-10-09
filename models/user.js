const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, default: null },
    name: { type: String, required: true },
    role: { type: String, required: true, enum: ['ADMIN', 'USER'], default: 'USER' },
    email: { type: String, required: true, unique: true },
    uid: { type: String, required: true, unique: true },
    points: { type: Number, default: 0 },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', default: null },
    permissions: [
      {
        type: String,
        enum: ['READ', 'ADD', 'UPDATE', 'DELETE', 'RESTORE', 'FORCE_DELETE'],
        default: null,
      },
    ],
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

userSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
userSchema.plugin(mongoosePaginate);

const User = mongoose.model('User', userSchema);

module.exports = User;

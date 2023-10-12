const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const historySchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  episodeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Episode', default: null },
  minutes: { type: Number, required: true },
  watchedAt: { type: Date, default: Date.now },
});

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
    favoriteMovies: [
      {
        type: {
          movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
          createdAt: { type: Date, default: Date.now },
        },
        default: [],
      },
    ],
    watchedList: { type: [historySchema], default: [] },
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

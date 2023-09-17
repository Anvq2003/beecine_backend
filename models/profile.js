const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    password: { type: String },
    isChildren: { type: Boolean, required: true, default: false },
    watchedMovies: [
      {
        episodeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Episode' },
        minutes: { type: Number, default: 0 },
        date: { type: Date, default: Date.now },
      },
    ],
    favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Episode' }],
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

profileSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;

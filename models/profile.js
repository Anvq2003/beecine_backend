const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    password: { type: String },
    isChildren: { type: Boolean, required: true, default: false },
    watchedMovies: [
      {
        movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
        episodeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Episode' },
        minutesWatched: { type: Number, default: 0 },
        lastWatchedAt: { type: Date, default: Date.now },
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

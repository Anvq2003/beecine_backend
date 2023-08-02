const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatarUrl: { type: String, required: true },
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
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;

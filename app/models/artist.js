const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  avatarUrl: { type: String, required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  bio: { type: String },
  country: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;

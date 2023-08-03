const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
var slug = require('mongoose-slug-updater');

const artistSchema = new mongoose.Schema(
  {
    avatarUrl: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, slug: 'name', unique: true },
    role: { type: String, required: true },
    bio: { type: String },
    country: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  {
    timestamps: true,
  },
);

mongoose.plugin(slug);
artistSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;

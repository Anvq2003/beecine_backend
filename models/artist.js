const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
var slug = require('mongoose-slug-updater');

const artistSchema = new mongoose.Schema(
  {
    avatarUrl: { type: String, required: true },
    name: { type: String, required: true },
    stageName: { type: String, required: true },
    slug: { type: String, slug: 'stageName', unique: true },
    roles: [{ type: String, required: true }],
    bio: { type: String },
    country: { type: String, required: true },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

mongoose.plugin(slug);
artistSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;

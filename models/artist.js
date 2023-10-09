const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
var slug = require('mongoose-slug-updater');
const mongoosePaginate = require('mongoose-paginate-v2');

const artistSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, slug: 'name', unique: true },
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
artistSchema.plugin(mongoosePaginate);

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;

const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
var slug = require('mongoose-slug-updater');

const genre = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, slug: 'name', unique: true },
    isChildren: { type: Boolean, required: true, default: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  {
    timestamps: true,
  },
);

// Add plugin
mongoose.plugin(slug);
genre.plugin(mongooseDelete, {
  overrideMethods: 'all',
  deletedAt: true,
});

module.exports = mongoose.model('Genre', genre);

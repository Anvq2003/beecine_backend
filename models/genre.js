const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
var slug = require('mongoose-slug-updater');
const mongoosePaginate = require('mongoose-paginate-v2');
const { languageSchema } = require('./language');

const genre = new mongoose.Schema(
  {
    name: { type: languageSchema, required: true },
    description: { type: languageSchema, required: true },
    order: { type: Number, required: true, default: 0, min: 0, max: 1000 },
    slug: { type: String, slug: 'name.en', unique: true },
    isChildren: { type: Boolean, required: true, default: false },
    movieCount: { type: Number, default: 0 },
    isHome: { type: Boolean, required: true, default: false },
    languages: { type: [String], default: ['en', 'vi'] },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

// Add plugin
mongoose.plugin(slug);
genre.plugin(mongoosePaginate);
genre.plugin(mongooseDelete, {
  overrideMethods: 'all',
  deletedAt: true,
});

const Genre = mongoose.model('Genre', genre);

module.exports = Genre;

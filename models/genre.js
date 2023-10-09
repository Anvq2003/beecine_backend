const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
var slug = require('mongoose-slug-updater');
const mongoosePaginate = require('mongoose-paginate-v2');
const { genreSchema } = require('../middlewares/validationSchemas');

const genre = new mongoose.Schema(
  {
    name: { type: String, required: true },
    order: { type: Number, required: true, default: 0 },
    slug: { type: String, slug: 'name', unique: true },
    isChildren: { type: Boolean, required: true, default: false },
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

module.exports = mongoose.model('Genre', genre);

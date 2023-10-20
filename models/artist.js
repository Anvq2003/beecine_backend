const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
var slug = require('mongoose-slug-updater');
const mongoosePaginate = require('mongoose-paginate-v2');
const { languageSchema, languageArraySchema } = require('./language');

const artistSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    name: { type: languageSchema, required: true },
    slug: { type: String, slug: 'name.en', unique: true },
    roles: { type: languageArraySchema },
    bio: { type: languageSchema },
    country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
    languages: { type: [String], default: ['en', 'vi'] },
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

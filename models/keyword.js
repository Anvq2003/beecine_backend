const mongoose = require('mongoose');
var slug = require('mongoose-slug-updater');
const mongoosePaginate = require('mongoose-paginate-v2');

const keywordSchema = new mongoose.Schema(
  {
    keyword: { type: String, required: true, trim: true, minLength: 3, maxLength: 255 },
    slug: { type: String, slug: 'keyword', unique: true },
    frequency: { type: Number, default: 0 },
    relatedKeys: [{ type: String, trim: true, minLength: 3, maxLength: 255 }],
  },
  {
    timestamps: true,
  },
);

// Add plugin
mongoose.plugin(slug);
keywordSchema.plugin(mongoosePaginate);

const Keyword = mongoose.model('Keyword', keywordSchema);

module.exports = Keyword;

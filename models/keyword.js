const mongoose = require('mongoose');
var slug = require('mongoose-slug-updater');

const keywordSchema = new mongoose.Schema(
  {
    keyword: { type: String, required: true },
    slug: { type: String, slug: 'keyword', unique: true },
    frequency: { type: Number, default: 0 },
    relatedKeys: [{ type: String }],
  },
  {
    timestamps: true,
  },
);

mongoose.plugin(slug);

const Keyword = mongoose.model('Keyword', keywordSchema);

module.exports = Keyword;

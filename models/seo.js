const mongoose = require('mongoose');

const SEOSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    keywords: [{ type: String, required: true }],
    imageUrl: { type: String, required: true },
    canonicalUrl: { type: String, required: true },
    robots: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const SEO = mongoose.model('SEO', SEOSchema);

module.exports = SEO;

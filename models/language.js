const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema(
  {
    en: { type: String, required: true, trim: true, minLength: 2, maxLength: 1000 },
    vi: { type: String, required: true, trim: true, minLength: 2, maxLength: 1000 },
  },
  { _id: false },
);

const imageSchema = new mongoose.Schema(
  {
    en: { type: String, required: true, trim: true, minLength: 2 },
    vi: { type: String, required: true, trim: true, minLength: 2 },
  },
  { _id: false },
);

const languageArraySchema = new mongoose.Schema(
  {
    en: { type: [String], trim: true, minLength: 1, maxLength: 255 },
    vi: { type: [String], trim: true, minLength: 1, maxLength: 255 },
  },
  { _id: false },
);

module.exports = { languageSchema, imageSchema, languageArraySchema };

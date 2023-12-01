const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const slug = require("mongoose-slug-updater");
const mongoosePaginate = require("mongoose-paginate-v2");
const { languageSchema, languageArraySchema, imageSchema } = require("./language");

const movieSchema = new mongoose.Schema(
  {
    title: { type: languageSchema, required: true },
    slug: { type: String, slug: "title.en", unique: true },
    description: { type: languageSchema },
    imageUrl: { type: imageSchema, required: true },
    videoUrl: { type: String, default: null },
    trailerUrl: { type: String },
    releaseDate: { type: Date, required: true },
    isSeries: { type: Boolean, default: false },
    isFree: { type: Boolean, default: true },
    duration: { type: Number },
    rating: { type: Number },
    tags: { type: [String], default: null },
    minimumAge: { type: Number, default: 0 },

    genres: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }], default: null },
    cast: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artist" }], default: null },
    directors: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artist" }], default: null },
    requiredSubscriptions: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subscription" }],
      default: null,
    },
    country: { type: mongoose.Schema.Types.ObjectId, ref: "Country", default: null },
    totalFavorites: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
    languages: { type: [String], default: ["en", "vi"] },

    // series
    totalEpisodes: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  },
);

mongoose.plugin(slug);
movieSchema.plugin(mongooseDelete, { overrideMethods: "all", deletedAt: true });
movieSchema.plugin(mongoosePaginate);
const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;

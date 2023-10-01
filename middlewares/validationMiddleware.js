const { validateDataAgainstSchema } = require('../helpers/validationHelper');
const {
  artistSchema,
  bannerSchema,
  billSchema,
  countrySchema,
  episodeSchema,
  episodeSingleSchema,
  genreSchema,
  commentSchema,
  movieSchema,
  subscriptionSchema,
  userSchema,
  featureFilmSchema,
} = require('./validationSchemas');

const validateCommentData = validateDataAgainstSchema(commentSchema);
const validateBillData = validateDataAgainstSchema(billSchema);
const validateCountryData = validateDataAgainstSchema(countrySchema);
const validateGenreData = validateDataAgainstSchema(genreSchema);
const validationArtistData = validateDataAgainstSchema(artistSchema);
const validationBannerData = validateDataAgainstSchema(bannerSchema);
const validationEpisodeData = validateDataAgainstSchema(episodeSchema);
const validationMovieSchema = validateDataAgainstSchema(movieSchema);
const validationSubscriptionSchema = validateDataAgainstSchema(subscriptionSchema);
const validationUserSchema = validateDataAgainstSchema(userSchema);
const validationFeatureFilmSchemaSchema = validateDataAgainstSchema(featureFilmSchema);

module.exports = {
  validateCommentData,
  validateBillData,
  validateCountryData,
  validateGenreData,
  validationArtistData,
  validationBannerData,
  validationEpisodeData,
  validationMovieSchema,
  validationSubscriptionSchema,
  validationUserSchema,
  validationFeatureFilmSchemaSchema,
};

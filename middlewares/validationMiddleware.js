const { validateDataAgainstSchema } = require('../helpers/validationHelper');
const {
  ageGroupSchema,
  artistSchema,
  bannerSchema,
  billSchema,
  countrySchema,
  episodeSchema,
  episodeSingleSchema,
  genreSchema,
  commentSchema,
  movieSchema,
  profileSchema,
  subscriptionSchema,
  userSchema,
  featureFilmSchema,
} = require('./validationSchemas');

const validateAgeGroupData = validateDataAgainstSchema(ageGroupSchema);
const validateCommentData = validateDataAgainstSchema(commentSchema);
const validateBillData = validateDataAgainstSchema(billSchema);
const validateCountryData = validateDataAgainstSchema(countrySchema);
const validateGenreData = validateDataAgainstSchema(genreSchema);
const validationArtistData = validateDataAgainstSchema(artistSchema);
const validationBannerData = validateDataAgainstSchema(bannerSchema);
const validationEpisodeData = validateDataAgainstSchema(episodeSchema);
const validationEpisodeSingleData = validateDataAgainstSchema(episodeSingleSchema);
const validationMovieSchema = validateDataAgainstSchema(movieSchema);
const validationProfileSchema = validateDataAgainstSchema(profileSchema);
const validationSubscriptionSchema = validateDataAgainstSchema(subscriptionSchema);
const validationUserSchema = validateDataAgainstSchema(userSchema);
const validationFeatureFilmSchemaSchema = validateDataAgainstSchema(featureFilmSchema);

module.exports = {
  validateAgeGroupData,
  validateCommentData,
  validateBillData,
  validateCountryData,
  validateGenreData,
  validationArtistData,
  validationBannerData,
  validationEpisodeData,
  validationMovieSchema,
  validationProfileSchema,
  validationEpisodeSingleData,
  validationSubscriptionSchema,
  validationUserSchema,
  validationFeatureFilmSchemaSchema,
};

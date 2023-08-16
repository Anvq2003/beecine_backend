const { validateDataAgainstSchema } = require('../helpers/validationHelper');
const {
  ageGroupSchema,
  artistSchema,
  bannerSchema,
  billSchema,
  countrySchema,
  episodeSchema,
  genreSchema,
  commentSchema,
  movieSchema,
  profileSchema,
  subscriptionSchema,
  userSchema,
} = require('./validationSchemas');

const validateAgeGroupData = validateDataAgainstSchema(ageGroupSchema);
const validateCommentData = validateDataAgainstSchema(commentSchema);
const validateBillData = validateDataAgainstSchema(billSchema);
const validateCountryData = validateDataAgainstSchema(countrySchema);
const validateGenreData = validateDataAgainstSchema(genreSchema);
const validationArtistData = validateDataAgainstSchema(artistSchema);
const validationBannerData = validateDataAgainstSchema(bannerSchema);
const validationEpisodeData = validateDataAgainstSchema(episodeSchema);
const validationMovieSchema = validateDataAgainstSchema(movieSchema);
const validationProfileSchema = validateDataAgainstSchema(profileSchema);
const validationSubscriptionSchema = validateDataAgainstSchema(subscriptionSchema);
const validationUserSchema = validateDataAgainstSchema(userSchema);

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
  validationSubscriptionSchema,
  validationUserSchema,
};

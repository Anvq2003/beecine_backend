const { validateDataAgainstSchema } = require('../helpers/validationHelper');
const {
  artistSchema,
  bannerSchema,
  billSchema,
  countrySchema,
  episodeSchema,
  genreSchema,
  commentSchema,
  movieSchema,
  subscriptionSchema,
  userSchema,
  featureFilmSchema,
  replySchema,
  refreshTokenSchema,
} = require('./validationSchemas');

const validateCommentData = validateDataAgainstSchema(commentSchema);
const validateReplyData = validateDataAgainstSchema(replySchema);
const validateBillData = validateDataAgainstSchema(billSchema);
const validateCountryData = validateDataAgainstSchema(countrySchema);
const validateGenreData = validateDataAgainstSchema(genreSchema);
const validationArtistData = validateDataAgainstSchema(artistSchema);
const validationBannerData = validateDataAgainstSchema(bannerSchema);
const validationEpisodeData = validateDataAgainstSchema(episodeSchema);

const validationMovie = validateDataAgainstSchema(movieSchema);
const validationSubscription = validateDataAgainstSchema(subscriptionSchema);
const validationUser = validateDataAgainstSchema(userSchema);
const validationFeatureFilm = validateDataAgainstSchema(featureFilmSchema);
const validationRefreshToken = validateDataAgainstSchema(refreshTokenSchema);

module.exports = {
  validateReplyData,
  validateCommentData,
  validateBillData,
  validateCountryData,
  validateGenreData,
  validationArtistData,
  validationBannerData,
  validationEpisodeData,
  validationMovie,
  validationSubscription,
  validationUser,
  validationFeatureFilm,
  validationRefreshToken,
};

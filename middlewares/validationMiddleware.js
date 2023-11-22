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
  replySchema,
  refreshTokenSchema,
  userAdminSchema,
  seoSchema,
} = require('./validationSchemas');

const validateCommentData = validateDataAgainstSchema(commentSchema);
const validateReplyData = validateDataAgainstSchema(replySchema);
const validateBillData = validateDataAgainstSchema(billSchema);
const validateCountryData = validateDataAgainstSchema(countrySchema);
const validateGenreData = validateDataAgainstSchema(genreSchema);
const validationArtistData = validateDataAgainstSchema(artistSchema);
const validationBannerData = validateDataAgainstSchema(bannerSchema);
const validationEpisodeData = validateDataAgainstSchema(episodeSchema);
const validationUserAdmin = validateDataAgainstSchema(userAdminSchema);

const validationMovie = validateDataAgainstSchema(movieSchema);
const validationSubscription = validateDataAgainstSchema(subscriptionSchema);
const validationUser = validateDataAgainstSchema(userSchema);
const validationRefreshToken = validateDataAgainstSchema(refreshTokenSchema);
const validationSeo = validateDataAgainstSchema(seoSchema);

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
  validationRefreshToken,
  validationUserAdmin,
  validationSeo,
};

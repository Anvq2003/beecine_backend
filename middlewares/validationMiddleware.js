const { validateDataAgainstSchema } = require('../helpers/validationHelper');
const {
  ageGroupSchema,
  commentSchema,
  billSchema,
  countrySchema,
  genreSchema,
} = require('./validationSchemas');

const validateAgeGroupData = validateDataAgainstSchema(ageGroupSchema);
const validateCommentData = validateDataAgainstSchema(commentSchema);
const validateBillData = validateDataAgainstSchema(billSchema);
const validateCountryData = validateDataAgainstSchema(countrySchema);
const validateGenreData = validateDataAgainstSchema(genreSchema);

module.exports = {
  validateAgeGroupData,
  validateCommentData,
  validateBillData,
  validateCountryData,
  validateGenreData,
};

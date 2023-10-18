const removeAccents = require('remove-accents');

const handleConvertStringToSlug = (str) => {
  if (typeof str !== 'string') return '';
  const newString = removeAccents(str.trim().split(' ').join('-'));
  return newString;
};

module.exports = {
  handleConvertStringToSlug,
};

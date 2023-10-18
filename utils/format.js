const removeAccents = require('remove-accents');

const handleConvertStringToSlug = (str) => {
  if (typeof str !== 'string') return '';
  const newString = removeAccents(str.trim().split(' ').join('-'));
  return newString;
};

function getMillisecondsInDuration(duration) {
  const units = {
    s: 1000, // second
    m: 1000 * 60, // minute
    h: 1000 * 60 * 60, // hour
    d: 1000 * 60 * 60 * 24, // day
  };

  const durationParts = duration.match(/(\d+)([smhd])/);
  if (durationParts) {
    const amount = parseInt(durationParts[1]);
    const unit = durationParts[2];
    return amount * units[unit];
  }
  return 0;
}

module.exports = {
  handleConvertStringToSlug,
  getMillisecondsInDuration,
};

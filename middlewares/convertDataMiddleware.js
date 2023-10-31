const _ = require('lodash');

const convertData = (req, res, next) => {
  const payload = req.body;
  const dataConverted = _.transform(
    payload,
    (result, value, key) => {
      const parts = key.split('.');
      if (parts.length === 1) {
        _.set(result, key, value);
      } else {
        const [firstPart, secondPart] = parts;
        if (secondPart === '0') {
          _.set(result, `${firstPart}`, [value]);
        } else {
          _.set(result, `${firstPart}.${secondPart}`, value);
        }
      }
    },
    {},
  );
  req.body = dataConverted;
  next();
};

module.exports = { convertData };

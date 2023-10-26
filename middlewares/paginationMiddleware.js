const config = require('../config');

const paginationMiddleware = (req, res, next) => {
  const { page, limit, sort, fields, search, populate } = req.query;
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;

  const options = {
    page: pageNum,
    limit: limitNum,
    customLabels: config.myCustomLabels,
  };

  if (sort) {
    options.sort = sort;
  }

  if (fields) {
    const fieldsArray = fields.split(',');
    options.select = fieldsArray.join(' ');
  }

  if (populate) {
    const populateArray = populate.split(',');
    options.populate = populateArray.join(' ');
  }

  if (populate === 'all') {
    options.populate = '';
  }

  if (search) {
    options.query = { $text: { $search: search } };
  }

  req.paginateOptions = options;
  next();
};
module.exports = { paginationMiddleware };

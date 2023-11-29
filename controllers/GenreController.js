const GenreModel = require('../models/genre');
const MovieModel = require('../models/movie');
const BaseController = require('./BaseController');
const paginationHelper = require('../helpers/Pagination');
const _ = require('lodash');
class GenreController extends BaseController {
  constructor() {
    super(GenreModel);
  }

  async getAdmin(req, res) {
    try {
      const { counts } = req.query;
      const options = req.paginateOptions;
      options.sort = { createdAt: -1 };
      options.populate = Object.keys(this.model.schema.paths).filter(
        (path) => path !== '_id' && path !== '__v',
      );

      const countFields = counts ? counts.split(',') : [];
      const allData = await this.model.findWithDeleted();

      const getKeyAndCount = countFields.map((value) => {
        const [field, fieldValue] = value.split(':');
        const count = allData.filter((item) => {
          switch (typeof item[field]) {
            case 'boolean':
              return item[field] === Boolean(fieldValue);
            case 'string':
              return item[field].toLowerCase() === fieldValue.toLowerCase();
            default:
              return item[field] === fieldValue;
          }
        }).length;
        return { [value]: count };
      });

      const count = {
        all: _.filter(allData, (item) => !item.deleted && item.status).length,
        active: _.filter(allData, (item) => item.status && !item.deleted).length,
        inactive: _.filter(allData, (item) => !item.status && !item.deleted).length,
        deleted: _.filter(allData, (item) => item.deleted).length,
        ...Object.assign({}, ...getKeyAndCount),
      };

      if (options.query && options.query.deleted) {
        let data = await this.model.findWithDeleted({ deleted: true }).populate(options.populate);
        const newData = paginationHelper({
          page: options.page,
          limit: options.limit,
          data,
        });

        return res.status(200).json({ ...newData, count, options });
      }

      const data = await this.model.paginate(options.query || {}, options);
      const pageData = { ...data, count };
      const newData = [...pageData.data];
      for (let i = 0; i < newData.length; i++) {
        const movieCount = await MovieModel.countDocuments({ genres: newData[i]._id });
        newData[i].movieCount = movieCount;
      }
      return res.status(200).json(pageData);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async checkGenreHasMovie(req, res, next) {
    try {
      const { id } = req.params;
      // movies = { _id: 1, genres: [1, 2, 3] }
      const movies = await MovieModel.findOne({ genres: id });
      return res.status(200).json(movies ? true : false);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new GenreController();

const ArtistModel = require('../models/artist');
const BaseController = require('./BaseController');
const mongoose = require('mongoose');
const { handleConvertStringToSlug } = require('../utils/format');

class ArtistController extends BaseController {
  constructor() {
    super(ArtistModel);
  }

  async getQuery(req, res, next) {
    try {
      const options = req.paginateOptions;
      options.populate = {
        path: 'country',
        select: 'name slug',
      };
      const data = await this.model.paginate({}, options);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getByParam(req, res, next) {
    try {
      const param = req.params.param;
      let data;

      if (mongoose.Types.ObjectId.isValid(param)) {
        data = await ArtistModel.findById(param).populate({
          path: 'country',
          select: 'name slug',
        });
      } else {
        data = await ArtistModel.findOne({ slug: param }).populate({
          path: 'country',
          select: 'name slug',
        });
      }

      if (!data) {
        return res.status(404).json({ message: 'Not found' });
      }

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getByKeyword(req, res) {
    const { q, type = 'less', limit = 6 } = req.query;
    const options = req.paginateOptions;
    if (!q) return res.status(400).json({ message: 'q(query) is required' });

    try {
      const query = {
        $or: [
          { 'title.vi': { $regex: q, $options: 'iu' } },
          { 'title.en': { $regex: q, $options: 'iu' } },
          { slug: { $regex: handleConvertStringToSlug(q), $options: 'iu' } },
        ],
      };

      if (type === 'less') {
        const movies = await ArtistModel.find(query);
        return res.status(200).json({
          data: movies.slice(0, limit),
          info: {
            totalResults: movies.length,
          },
        });
      } else if (type === 'more') {
        const movies = await ArtistModel.paginate(query, options);
        return res.status(200).json(movies);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ArtistController();

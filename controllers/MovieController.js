const MovieModel = require('../models/movie');
const BaseController = require('./BaseController');
const mongoose = require('mongoose');

class MovieController extends BaseController {
  constructor() {
    super(MovieModel);
  }

  async getByParam(req, res, next) {
    try {
      const param = req.params.param;
      let data;

      if (mongoose.Types.ObjectId.isValid(param)) {
        data = await MovieModel.findById(param);
      } else {
        data = await MovieModel.findOne({ slug: param });
      }

      if (!data) {
        return res.status(404).json({ message: 'Not found' });
      }

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async create(req, res, next) {
    try {
      const genres = JSON.parse(req.body.genres);
      const cast = JSON.parse(req.body.cast);
      const directors = JSON.parse(req.body.directors);
      const country = JSON.parse(req.body.country);

      const movieData = {
        ...req.body,
        genres,
        cast,
        directors,
        country,
      };

      const data = new MovieModel(movieData);
      const savedCategory = await data.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async update(req, res, next) {
    try {
      const genres = JSON.parse(req.body.genres);
      const cast = JSON.parse(req.body.cast);
      const directors = JSON.parse(req.body.directors);
      const country = JSON.parse(req.body.country);

      const movieData = {
        ...req.body,
        genres,
        cast,
        directors,
        country,
      };

      const data = await MovieModel.findByIdAndUpdate(
        req.params.id,
        { $set: movieData },
        { new: true },
      );
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new MovieController();

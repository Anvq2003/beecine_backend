const MovieModel = require('../models/movie');
const BaseController = require('./BaseController');
class MovieController extends BaseController {
  constructor() {
    super(MovieModel);
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
      const tags = JSON.parse(req.body.tags);

      const movieData = {
        ...req.body,
        genres,
        cast,
        directors,
        country,
        tags,
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

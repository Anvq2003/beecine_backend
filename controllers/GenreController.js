const GenreModel = require('../models/genre');
const MovieModel = require('../models/movie');
const BaseController = require('./BaseController');
class GenreController extends BaseController {
  constructor() {
    super(GenreModel);
  }

  async checkGenreHasMovie(req, res, next) {
    try {
      const { id } = req.params;
      // movies = { _id: 1, genres: [1, 2, 3] }
      const movies = await MovieModel.findOne({ genres: id });
      return res.status(200).json(movies ? true : false);
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }
}

module.exports = new GenreController();

const GenreModel = require('../models/genre');
const BaseController = require('./BaseController');
class GenreController extends BaseController {
  constructor() {
    super(GenreModel);
  }

  async getHomePage(req, res) {
    try {
      const genres = await GenreModel.find({ isHome: true }).sort({ order: -1 });
      if (!genres) return res.status(404).json('Genre not found');
      res.status(200).json(genres);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new GenreController();

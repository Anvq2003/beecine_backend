const EpisodeModel = require('../models/episode');
const BaseController = require('./BaseController');
class EpisodeController extends BaseController {
  constructor() {
    super(EpisodeModel);
  }

  async getByMovieId(req, res, next) {
    try {
      const { id } = req.params;
      const episode = await EpisodeModel.findOne({
        movieId: id,
      });
      if (!episode) return res.status(404).json('Episode not found');
      res.status(200).json(episode);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new EpisodeController();

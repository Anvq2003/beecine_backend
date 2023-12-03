const EpisodeModel = require('../models/episode');
const BaseController = require('./BaseController');
const _ = require('lodash');
class EpisodeController extends BaseController {
  constructor() {
    super(EpisodeModel);
  }

  async update(req, res) {
    try {
      const pathsToPopulate = Object.keys(this.model.schema.paths).filter(
        (path) => path !== '_id' && path !== '__v',
      );
      const slug = req.body.title.vi;
      req.body.slug = handleConvertStringToSlug(slug);
      const data = await this.model
        .findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        .populate(pathsToPopulate);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getByMovieId(req, res) {
    try {
      const { id } = req.params;
      const { season = 1 } = req.query;
      if (!id) return res.status(400).json('Movie id is required');

      const episode = await EpisodeModel.find({ movieId: id, season });
      if (!episode) return res.status(404).json('Episode not found');
      res.status(200).json(episode);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new EpisodeController();

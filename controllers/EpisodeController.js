const EpisodeModel = require('../models/episode');
const BaseController = require('./BaseController');
class EpisodeController extends BaseController {
  constructor() {
    super(EpisodeModel);
  }
}

module.exports = new EpisodeController();

const MovieModel = require('../models/movie');
const BaseController = require('./BaseController');
class MovieController extends BaseController {
  constructor() {
    super(MovieModel);
  }
}

module.exports = new MovieController();

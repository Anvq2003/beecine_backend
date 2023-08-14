const GenreModel = require('../models/genre');
const BaseController = require('./BaseController');
class GenreController extends BaseController {
  constructor() {
    super(GenreModel);
  }
}

module.exports = new GenreController();

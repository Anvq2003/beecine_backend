const ArtistModel = require('../models/artist');
const BaseController = require('./BaseController');
class ArtistController extends BaseController {
  constructor() {
    super(ArtistModel);
  }
}

module.exports = new ArtistController();

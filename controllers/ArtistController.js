const ArtistModel = require('../models/artist');
const BaseController = require('./BaseController');
class ArtistController extends BaseController {
  constructor() {
    super(ArtistModel);
  }

  async create(req, res, next) {
    // try {
    const roles = JSON.parse(req.body.roles);
    const artistData = {
      ...req.body,
      roles,
    };

    const data = new ArtistModel(artistData);
    const savedData = await data.save();
    res.status(200).json(savedData);
    // } catch (error) {
    //   res.status(500).json(error.message);
    // }
  }
}

module.exports = new ArtistController();

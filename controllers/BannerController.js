const BannerModel = require('../models/banner');
const BaseController = require('./BaseController');
class BannerController extends BaseController {
  constructor() {
    super(BannerModel);
  }

  async create(req, res, next) {
    try {
      const genres = JSON.parse(req.body.genres);
      const cast = JSON.parse(req.body.cast);
      const directors = JSON.parse(req.body.directors);
      const bannerData = {
        ...req.body,
        genres,
        cast,
        directors,
      };

      const data = new BannerModel(bannerData);
      const savedBanner = await data.save();
      res.status(200).json(savedBanner);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async update(req, res, next) {
    try {
      const genres = JSON.parse(req.body.genres);
      const cast = JSON.parse(req.body.cast);
      const directors = JSON.parse(req.body.directors);

      const bannerData = {
        ...req.body,
        genres,
        cast,
        directors,
      };

      const data = await BannerModel.findByIdAndUpdate(
        req.params.id,
        { $set: bannerData },
        { new: true },
      );
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new BannerController();

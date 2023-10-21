const BannerModel = require('../models/banner');
const BaseController = require('./BaseController');
class BannerController extends BaseController {
  constructor() {
    super(BannerModel);
  }

  async getQuery(req, res, next) {
    try {
      const options = req.paginateOptions;
      options.populate = {
        path: 'movieId',
        populate: {
          path: 'genres cast directors country',
          select: 'name slug',
        },
      };
      const data = await BannerModel.paginate({}, options);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new BannerController();

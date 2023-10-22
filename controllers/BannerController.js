const BannerModel = require('../models/banner');
const BaseController = require('./BaseController');
class BannerController extends BaseController {
  constructor() {
    super(BannerModel);
  }
}

module.exports = new BannerController();

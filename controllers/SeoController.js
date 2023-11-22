const SeoModel = require('../models/seo');
const BaseController = require('./BaseController');

class SeoController extends BaseController {
  constructor() {
    super(SeoModel);
  }

}

module.exports = new SeoController();

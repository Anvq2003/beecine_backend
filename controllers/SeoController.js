const SeoModel = require('../models/seo');
const BaseController = require('./BaseController');

class SeoController extends BaseController {
  constructor() {
    super(SeoModel);
  }

  async update(req, res) {
    try {
      const _id = req?.body?._id;
      const data = await SeoModel.findByIdAndUpdate(_id, req.body, { upsert: true });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new SeoController();

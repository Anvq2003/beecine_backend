const RefreshTokenModel = require('../models/refreshToken');
const BaseController = require('./BaseController');

class RefreshToken extends BaseController {
  constructor() {
    super(RefreshTokenModel);
  }

  async getQuery(req, res) {
    try {
      const data = await RefreshTokenModel.find();
      return res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const data = await RefreshTokenModel.findByIdAndDelete(id);
      return res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new RefreshToken();

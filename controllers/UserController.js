const BaseController = require('./BaseController');
const UserModel = require('../models/user');

class UserController extends BaseController {
  constructor() {
    super(UserModel);
  }

  async getTop(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const data = await UserModel.find().sort({ createdAt: -1 }).limit(limit);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  }

  async checkEmail(req, res) {
    try {
      const email = req.params.id;
      const existEmail = UserModel.findOne({ email: email });
      res.status(200).json(existEmail ? true : false);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new UserController();

const BaseController = require('./BaseController');
const UserModel = require('../models/user');

class UserController extends BaseController {
  constructor() {
    super(UserModel);
  }
}

module.exports = new UserController();

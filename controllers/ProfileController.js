const ProfileModel = require('../models/profile');
const BaseController = require('./BaseController');
class ProfileController extends BaseController {
  constructor() {
    super(ProfileModel);
  }
}

module.exports = new ProfileController();

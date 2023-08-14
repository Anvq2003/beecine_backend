const BaseController = require('./BaseController');
const AgeGroupModel = require('../models/ageGroup');

class AgeGroupController extends BaseController {
  constructor() {
    super(AgeGroupModel);
  }
}

module.exports = new AgeGroupController();

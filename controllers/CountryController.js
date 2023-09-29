const CountryModel = require('../models/country');
const BaseController = require('./BaseController');

class CountryController extends BaseController {
  constructor() {
    super(CountryModel);
  }
}

module.exports = new CountryController();

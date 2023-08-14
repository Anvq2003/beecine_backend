const SubscriptionModel = require('../models/subscription');
const BaseController = require('./BaseController');
class SubscriptionController extends BaseController {
  constructor() {
    super(SubscriptionModel);
  }
}

module.exports = new SubscriptionController();

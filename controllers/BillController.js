const BillModel = require('../models/bill');
const BaseController = require('./BaseController');
class BillController extends BaseController {
  constructor() {
    super(BillModel);
  }
}

module.exports = new BillController();

const BillModel = require('../models/bill');
const BaseController = require('./BaseController');
class BillController extends BaseController {
  constructor() {
    super(BillModel);
  }

  async getAll(req, res, next) {
    try {
      const data = await BillModel.find().populate('userId').populate('subscriptionId');
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new BillController();

const BillModel = require('../models/bill');
const BaseController = require('./BaseController');
class BillController extends BaseController {
  constructor() {
    super(BillModel);
  }

  async getAll(req, res) {
    try {
      const data = await BillModel.find().populate('userId').populate('subscriptionId');
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  }

  async getTop(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const data = await BillModel.find()
        .populate('userId')
        .populate('subscriptionId')
        .sort({ createdAt: -1 })
        .limit(limit);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new BillController();

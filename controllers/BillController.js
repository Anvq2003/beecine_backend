const BillModel = require('../models/bill');
const SubscriptionModel = require('../models/subscription');
const UserModel = require('../models/user');
const BaseController = require('./BaseController');

class BillController extends BaseController {
  constructor() {
    super(BillModel);
  }

  async create(req, res) {
    const { userId, subscriptionId } = req.body;
    try {
      const subscription = await SubscriptionModel.findById(subscriptionId);
      if (!subscription) {
        return res.status(404).json({ message: 'Subscription not found' });
      }
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const oneDay = 24 * 60 * 60 * 1000;
      subscription.duration = parseInt(subscription.duration); // 30 (days)
      const end = Date.now() + subscription.duration * oneDay;

      const bill = {
        userId,
        subscriptionId,
        startDate: Date.now(),
        endDate: end,
        total: subscription.price,
      };

      await BillModel.create(bill);
      await UserModel.findByIdAndUpdate(userId, { subscription: subscriptionId });
      res.status(201).json({ message: 'Create bill successfully' });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getAll(req, res) {
    try {
      const data = await BillModel.find().populate('userId').populate('subscriptionId');
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
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
      res.status(500).json(error.message);
    }
  }
}

module.exports = new BillController();

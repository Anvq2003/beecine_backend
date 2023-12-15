require('dotenv').config();
const BillModel = require('../models/bill');
const SubscriptionModel = require('../models/subscription');
const UserModel = require('../models/user');
const BaseController = require('./BaseController');
const { sendMail } = require('../helpers/sender');
const generateOTP = require('../helpers/generateOTP');

class BillController extends BaseController {
  constructor() {
    super(BillModel);
  }

  async getByUser(req, res) {
    const { id } = req.params;
    try {
      const options = req.paginateOptions;
      options.populate = [{ path: 'userId' }, { path: 'subscriptionId' }];
      const data = await BillModel.paginate({ userId: id }, options);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async create(req, res) {
    const { subscriptionId, usedCoin = 0, paymentMethod = 'online' } = req.body;
    const userId = req.user._id;
    try {
      const subscription = await SubscriptionModel.findById(subscriptionId);
      if (!subscription) {
        return res.status(404).json({ message: 'Subscription not found' });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user?.checkIn.points < usedCoin) {
        return res.status(400).json({ message: 'Not enough coin' });
      }

      const oneDay = 24 * 60 * 60 * 1000;
      subscription.duration = parseInt(subscription.duration);
      const end = Date.now() + subscription.duration * oneDay;
      const code = 'BEECINE' + generateOTP();

      const bill = {
        code,
        userId,
        subscriptionId,
        usedCoin,
        paymentMethod,
        endDate: end,
        startDate: Date.now(),
        total: subscription.price,
      };

      const html = `
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Thông tin chi tiết</th>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">
                <p>Người dùng: <b>${user?.name}</b></p>
                <p>Mã hóa đơn: <b>${code}</b></p>
                <p>Gói dịch vụ: <b>${subscription?.name?.vi}</b></p>
                <p>Giá: <b>${subscription?.price?.toLocaleString()} VNĐ</b></p>
                <p>Số coin sử dụng: <b>${usedCoin}</b></p>
                <p>Tổng tiền: <b>${subscription?.price?.toLocaleString()} VNĐ</b></p>
                <p>Phương thức thanh toán: <b>${paymentMethod}</b></p>
                <p>Ngày hết hạn: <b>${new Date(end).toLocaleDateString()}</b></p>
              </td>
            </tr>
          </table>`;

      const info = {
        from: {
          name: 'Beecine',
          address: process.env.EMAIL,
        },
        to: user.email,
        subject: 'Hóa đơn thanh toán Beecine',
        text: `Chúc mừng bạn đã đăng ký thành công gói dịch vụ ${subscription?.name?.vi}`,
        html: html,
      };
      

      await BillModel.updateMany({ userId }, { endDate: Date.now(), status: 'CANCELLED' });
      await BillModel.create(bill);
      const dataUser = await UserModel.findByIdAndUpdate(userId, {
        subscription: subscriptionId,
        $inc: { 'checkIn.points': -usedCoin },
      });

      await sendMail(info);
      res.status(201).json({ message: 'Create bill successfully', data: bill, user: dataUser });
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

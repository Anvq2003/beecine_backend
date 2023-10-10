const BaseController = require('./BaseController');
const UserModel = require('../models/user');

class UserController extends BaseController {
  constructor() {
    super(UserModel);
  }

  async getByUid(req, res) {
    try {
      const uid = req.params.id;
      const user = await UserModel.findOne({ uid: uid });
      if (!user) {
        return res.status(404).json({ message: 'Not found' });
      }
      const newUserData = {
        _id: user._id,
        uid: user.uid,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
        subscription: user.subscription,
        createdAt: user.createdAt,
      };
      res.status(200).json(newUserData);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async create(req, res) {
    try {
      // check email and uid
      const { email, uid } = req.body;
      const exist = await UserModel.findOne({
        $or: [{ email }, { uid }],
      });
      if (exist) {
        return res.status(400).json({ message: 'Email or uid already exists' });
      }
      const data = new UserModel(req.body);
      const savedData = await data.save();
      res.status(200).json(savedData);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async createWithGoogle(req, res) {
    try {
      const { email, uid } = req.body;
      const user = await UserModel.findOne({
        $or: [{ email }, { uid }],
      });
      if (user) {
        Object.assign(user, req.body);
        const savedData = await user.save();
        return res.status(200).json(savedData);
      }
      const data = new UserModel(req.body);
      const savedData = await data.save();
      res.status(200).json(savedData);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getTop(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const data = await UserModel.find().sort({ createdAt: -1 }).limit(limit);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  }

  async checkEmail(req, res) {
    try {
      const email = req.params.id;
      const existEmail = UserModel.findOne({ email: email });
      res.status(200).json(existEmail ? true : false);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new UserController();

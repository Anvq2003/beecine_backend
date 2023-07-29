const mongoose = require('mongoose');
const UserSubscriptionModel = require('../models/userSubscription');

class UserSubscriptionController {
  // [GET] api/userSubscriptions
  async getQuery(req, res) {
    try {
      const query = Object.assign({}, req.query);
      const data = await UserSubscriptionModel.find(query);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [GET] api/userSubscriptions/:id
  async getOne(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }
      const data = await UserSubscriptionModel.findById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [POST] api/userSubscriptions/store
  async create(req, res) {
    try {
      const data = new UserSubscriptionModel(req.body);
      const savedCategory = await data.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [POST] api/userSubscriptions/store-many
  async createMany(req, res) {
    try {
      const data = await UserSubscriptionModel.insertMany(req.body);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [PUT] api/userSubscriptions/update/:id
  async update(req, res) {
    try {
      const data = await UserSubscriptionModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [DELETE] api/userSubscriptions/delete/:id
  async delete(req, res) {
    try {
      await UserSubscriptionModel.findByIdAndDelete(req.params.id);
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = new UserSubscriptionController();

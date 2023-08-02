const mongoose = require('mongoose');
const SubscriptionModel = require('../models/subscription');

class SubscriptionController {
  // [GET] api/subscriptions
  async getQuery(req, res, next) {
    try {
      const query = Object.assign({}, req.query);
      const data = await SubscriptionModel.find(query);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [GET] api/subscriptions/:id
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }
      const data = await SubscriptionModel.findById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [POST] api/subscriptions/store
  async create(req, res, next) {
    try {
      const data = new SubscriptionModel(req.body);
      const savedCategory = await data.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [POST] api/subscriptions/store-many
  async createMany(req, res, next) {
    try {
      const data = await SubscriptionModel.insertMany(req.body);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [PUT] api/subscriptions/update/:id
  async update(req, res, next) {
    try {
      const data = await SubscriptionModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [DELETE] api/subscriptions/delete/:id
  async delete(req, res, next) {
    try {
      await SubscriptionModel.findByIdAndDelete(req.params.id);
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = new SubscriptionController();

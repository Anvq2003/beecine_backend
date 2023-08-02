const mongoose = require('mongoose');
const AgeGroupModel = require('../models/ageGroup');

class AgeGroupController {
  // [GET] api/age-groups
  async getQuery(req, res, next) {
    try {
      const query = Object.assign({}, req.query);
      const data = await AgeGroupModel.find(query);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [GET] api/age-groups/:id
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }
      const data = await AgeGroupModel.findById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [POST] api/age-groups/store
  async create(req, res, next) {
    try {
      const data = new AgeGroupModel(req.body);
      const savedCategory = await data.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [POST] api/age-groups/store-many
  async createMany(req, res, next) {
    try {
      const data = await AgeGroupModel.insertMany(req.body);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [PUT] api/age-groups/update/:id
  async update(req, res, next) {
    try {
      const data = await AgeGroupModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [DELETE] api/age-groups/delete/:id
  async delete(req, res, next) {
    try {
      await AgeGroupModel.findByIdAndDelete(req.params.id);
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = new AgeGroupController();

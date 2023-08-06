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
      res.status(500).json(error.message);
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
      res.status(500).json(error.message);
    }
  }

  // [POST] api/age-groups/store
  async create(req, res, next) {
    try {
      const data = new AgeGroupModel(req.body);
      const savedCategory = await data.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [POST] api/age-groups/store-many
  async createMany(req, res, next) {
    try {
      const data = await AgeGroupModel.insertMany(req.body);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [PUT] api/age-groups/update/:id
  async update(req, res, next) {
    try {
      const data = await AgeGroupModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/age-groups/delete/:id
  async delete(req, res, next) {
    try {
      await AgeGroupModel.delete({ _id: req.params.id });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/age-groups/delete-many
  async deleteMany(req, res, next) {
    const { ids } = req.body;
    try {
      await AgeGroupModel.deleteMany({ _id: { $in: ids } });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [GET] api/age-groups/trash
  async getTrash(req, res, next) {
    try {
      const data = await AgeGroupModel.findDeleted();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [PATCH] api/age-groups/restore/:id
  async restore(req, res, next) {
    try {
      const data = await AgeGroupModel.restore({ _id: req.params.id });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/age-groups/force/:id
  async forceDelete(req, res, next) {
    try {
      await AgeGroupModel.findByIdAndDelete(req.params.id);
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new AgeGroupController();

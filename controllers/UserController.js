const mongoose = require('mongoose');
const UserModel = require('../models/user');

class UserController {
  // [GET] api/user
  async getQuery(req, res, next) {
    try {
      const query = Object.assign({}, req.query);
      const data = await UserModel.find(query);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [GET] api/user/:id
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }
      const data = await UserModel.findById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [POST] api/user/store
  async create(req, res, next) {
    try {
      const data = new UserModel(req.body);
      const savedCategory = await data.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [POST] api/user/store-many
  async createMany(req, res, next) {
    try {
      const data = await UserModel.insertMany(req.body);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [PUT] api/user/update/:id
  async update(req, res, next) {
    try {
      const data = await UserModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [DELETE] api/users/delete/:id
  async delete(req, res, next) {
    try {
      await UserModel.delete({ _id: req.params.id });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [DELETE] api/users/delete-many
  async deleteMany(req, res, next) {
    const { ids } = req.body;
    try {
      await UserModel.deleteMany({ _id: { $in: ids } });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [GET] api/users/trash
  async getTrash(req, res, next) {
    try {
      const data = await UserModel.findDeleted();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [PATCH] api/users/restore/:id
  async restore(req, res, next) {
    try {
      const data = await UserModel.restore({ _id: req.params.id });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [DELETE] api/users/force/:id
  async forceDelete(req, res, next) {
    try {
      await UserModel.findByIdAndDelete(req.params.id);
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = new UserController();

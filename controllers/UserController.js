const mongoose = require('mongoose');
const UserModel = require('../models/user');
const { uploadImageSingle } = require('../services/uploadServices');

class UserController {
  // [GET] api/user
  async getQuery(req, res, next) {
    try {
      const query = Object.assign({}, req.query);
      const data = await UserModel.find(query);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
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
      res.status(500).json(error.message);
    }
  }

  // [POST] api/user/store
  async create(req, res, next) {
    try {
      const data = new UserModel(req.body);
      const savedCategory = await data.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [POST] api/user/store-many
  async createMany(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Invalid file' });
      }
      const data = await UserModel.insertMany(req.body);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [PUT] api/user/update/:id
  async update(req, res, next) {
    try {
      if (req.file) {
        const file = req.file;
        const uploadedFile = await uploadImageSingle(file);
        req.body.avatarUrl = uploadedFile;
      }
      const data = await UserModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/users/delete/:id
  async delete(req, res, next) {
    try {
      const file = req.file;
      const uploadedFile = await uploadImageSingle(file);
      req.body.avatarUrl = uploadedFile;

      await UserModel.delete({ _id: req.params.id });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/users/delete-many
  async deleteMany(req, res, next) {
    const { ids } = req.body;
    try {
      await UserModel.deleteMany({ _id: { $in: ids } });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [GET] api/users/trash
  async getTrash(req, res, next) {
    try {
      const data = await UserModel.findDeleted();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [PATCH] api/users/restore/:id
  async restore(req, res, next) {
    try {
      const data = await UserModel.restore({ _id: req.params.id });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/users/force/:id
  async forceDelete(req, res, next) {
    try {
      await UserModel.findByIdAndDelete(req.params.id);
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new UserController();

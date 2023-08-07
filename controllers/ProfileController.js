const mongoose = require('mongoose');
const ProfileModel = require('../models/profile');
const { uploadImageSingle } = require('../services/uploadServices');

class ProfileController {
  // [GET] api/profiles
  async getQuery(req, res, next) {
    try {
      const query = Object.assign({}, req.query);
      const data = await ProfileModel.find(query);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [GET] api/profiles/:id
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }
      const data = await ProfileModel.findById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [POST] api/profiles/store
  async create(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Invalid file' });
      }
      const file = req.file;
      const uploadedFile = await uploadImageSingle(file);
      req.body.avatarUrl = uploadedFile;

      const data = new ProfileModel(req.body);
      const savedCategory = await data.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [POST] api/profiles/store-many
  async createMany(req, res, next) {
    try {
      const data = await ProfileModel.insertMany(req.body);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [PUT] api/profiles/update/:id
  async update(req, res, next) {
    try {
      const data = await ProfileModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/profiles/delete/:id
  async delete(req, res, next) {
    try {
      await ProfileModel.delete({ _id: req.params.id });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/profiles/delete-many
  async deleteMany(req, res, next) {
    const { ids } = req.body;
    try {
      await ProfileModel.deleteMany({ _id: { $in: ids } });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [GET] api/profiles/trash
  async getTrash(req, res, next) {
    try {
      const data = await ProfileModel.findWithDeleted({
        deleted: true,
      });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [PATCH] api/profiles/restore/:id
  async restore(req, res, next) {
    try {
      const data = await ProfileModel.restore({ _id: req.params.id });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/profiles/force/:id
  async forceDelete(req, res, next) {
    try {
      await ProfileModel.findByIdAndDelete(req.params.id);
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new ProfileController();

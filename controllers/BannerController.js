const mongoose = require('mongoose');
const BannerModel = require('../models/banner');
const { uploadImageSingle } = require('../services/uploadServices');
class BannerController {
  // [GET] api/banners
  async getQuery(req, res, next) {
    try {
      const query = Object.assign({}, req.query);
      const data = await BannerModel.find(query);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [GET] api/banners/:id
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }
      const data = await BannerModel.findById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [POST] api/banners/store
  async create(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Invalid file' });
      }
      const file = req.file;
      const uploadedFile = await uploadImageSingle(file);
      req.body.imageUrl = uploadedFile;

      const data = new BannerModel(req.body);
      const savedCategory = await data.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [POST] api/banners/store-many
  async createMany(req, res, next) {
    try {
      const file = req.file;
      const uploadedFile = await uploadImageSingle(file);
      req.body.imageUrl = uploadedFile;

      const data = await BannerModel.insertMany(req.body);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [PUT] api/banners/update/:id
  async update(req, res, next) {
    try {
      if (req.file) {
        const file = req.file;
        const uploadedFile = await uploadImageSingle(file);
        req.body.imageUrl = uploadedFile;
      }
      const data = await BannerModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/banners/delete/:id
  async delete(req, res, next) {
    try {
      await BannerModel.delete({ _id: req.params.id });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/banners/delete-many
  async deleteMany(req, res, next) {
    const { ids } = req.body;
    try {
      await BannerModel.deleteMany({ _id: { $in: ids } });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [GET] api/banners/trash
  async getTrash(req, res, next) {
    try {
      const data = await BannerModel.findWithDeleted({
        deleted: true,
      });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [PATCH] api/banners/restore/:id
  async restore(req, res, next) {
    try {
      const data = await BannerModel.restore({ _id: req.params.id });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/banners/force/:id
  async forceDelete(req, res, next) {
    try {
      await BannerModel.findByIdAndDelete(req.params.id);
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new BannerController();

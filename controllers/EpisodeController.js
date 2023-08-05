const mongoose = require('mongoose');
const EpisodeModel = require('../models/episode');
const { uploadImageSingle } = require('../services/uploadServices');

class EpisodeController {
  // [GET] api/episodes
  async getQuery(req, res, next) {
    try {
      const query = Object.assign({}, req.query);
      const data = await EpisodeModel.find(query);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [GET] api/episodes/:id
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }
      const data = await EpisodeModel.findById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [POST] api/episodes/store
  async create(req, res, next) {
    try {
      const file = req.file;
      const uploadedFile = await uploadImageSingle(file);
      req.body.thumbnailUrl = uploadedFile;

      const data = new EpisodeModel(req.body);
      const savedCategory = await data.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [PUT] api/episodes/update/:id
  async update(req, res, next) {
    try {
      const data = await EpisodeModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [DELETE] api/episodes/delete/:id
  async delete(req, res, next) {
    try {
      await EpisodeModel.delete({ _id: req.params.id });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [DELETE] api/episodes/delete-many
  async deleteMany(req, res, next) {
    const { ids } = req.body;
    try {
      await EpisodeModel.deleteMany({ _id: { $in: ids } });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [GET] api/episodes/trash
  async getTrash(req, res, next) {
    try {
      const data = await EpisodeModel.findDeleted();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [PATCH] api/episodes/restore/:id
  async restore(req, res, next) {
    try {
      const data = await EpisodeModel.restore({ _id: req.params.id });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [DELETE] api/episodes/force/:id
  async forceDelete(req, res, next) {
    try {
      await EpisodeModel.findByIdAndDelete(req.params.id);
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = new EpisodeController();

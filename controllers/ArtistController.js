const mongoose = require('mongoose');
const ArtistModel = require('../models/artist');

class ArtistController {
  // [GET] api/artists
  async getQuery(req, res, next) {
    try {
      const query = Object.assign({}, req.query);
      const data = await ArtistModel.find(query);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [GET] api/artists/:id
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }
      const data = await ArtistModel.findById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [POST] api/artists/store
  async create(req, res, next) {
    try {
      const data = new ArtistModel(req.body);
      const savedCategory = await data.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [PUT] api/artists/update/:id
  async update(req, res, next) {
    try {
      const data = await ArtistModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [DELETE] api/artists/delete/:id
  async delete(req, res, next) {
    try {
      await ArtistModel.delete({ _id: req.params.id });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [DELETE] api/artists/delete-many
  async deleteMany(req, res, next) {
    const { ids } = req.body;
    try {
      await ArtistModel.deleteMany({ _id: { $in: ids } });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [GET] api/artists/trash
  async getTrash(req, res, next) {
    try {
      const data = await ArtistModel.findDeleted();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [PATCH] api/artists/restore/:id
  async restore(req, res, next) {
    try {
      const data = await ArtistModel.restore({ _id: req.params.id });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [DELETE] api/artists/force/:id
  async forceDelete(req, res, next) {
    try {
      await ArtistModel.findByIdAndDelete(req.params.id);
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = new ArtistController();

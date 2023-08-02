const mongoose = require('mongoose');
const unidecode = require('unidecode');
const ArtistModel = require('../models/artist');

class ArtistController {
  // [GET] api/genres
  async getQuery(req, res, next) {
    try {
      const query = Object.assign({}, req.query);
      const data = await ArtistModel.find(query);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [GET] api/genres/:id
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

  // [POST] api/genres/store
  async create(req, res, next) {
    try {
      req.body.slug = unidecode(req.body.name)
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/-+/g, '-');
      const data = new ArtistModel(req.body);
      const savedCategory = await data.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [PUT] api/genres/update/:id
  async update(req, res, next) {
    try {
      req.body.slug = unidecode(req.body.name)
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/-+/g, '-');
      const data = await ArtistModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [DELETE] api/genres/delete/:id
  async delete(req, res, next) {
    try {
      await ArtistModel.findByIdAndDelete(req.params.id);
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = new ArtistController();

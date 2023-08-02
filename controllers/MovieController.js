const mongoose = require('mongoose');
const unidecode = require('unidecode');
const MovieModel = require('../models/movie');

class MovieController {
  // [GET] api/movies
  async getQuery(req, res, next) {
    try {
      const query = Object.assign({}, req.query);
      const data = await MovieModel.find(query);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [GET] api/movies/:id
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }
      const data = await MovieModel.findById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [POST] api/movies/store
  async create(req, res, next) {
    // try {
    req.body.slug = unidecode(req.body.title)
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/-+/g, '-');
    const data = new MovieModel(req.body);
    const savedCategory = await data.save();
    res.status(200).json(savedCategory);
    // } catch (error) {
    //   res.status(500).json(error);
    // }
  }

  // [PUT] api/movies/update/:id
  async update(req, res, next) {
    try {
      req.body.slug = unidecode(req.body.title)
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/-+/g, '-');
      const data = await MovieModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [DELETE] api/movies/delete/:id
  async delete(req, res, next) {
    try {
      await MovieModel.findByIdAndDelete(req.params.id);
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = new MovieController();
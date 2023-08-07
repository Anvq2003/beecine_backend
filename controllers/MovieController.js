const mongoose = require('mongoose');
var serialize = require('serialize-javascript');

const MovieModel = require('../models/movie');
const { uploadImageSingle } = require('../services/uploadServices');

class MovieController {
  // [GET] api/movies
  async getQuery(req, res, next) {
    try {
      const query = Object.assign({}, req.query);
      const data = await MovieModel.find(query);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
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
      res.status(500).json(error.message);
    }
  }

  // [POST] api/movies/store
  async create(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Invalid file' });
      }
      const file = req.file;
      const uploadedFile = await uploadImageSingle(file);
      req.body.thumbnailUrl = uploadedFile;

      const genres = JSON.parse(req.body.genres);
      const cast = JSON.parse(req.body.cast);
      const directors = JSON.parse(req.body.directors);
      const country = JSON.parse(req.body.country);
      const tags = JSON.parse(req.body.tags);

      const movieData = {
        ...req.body,
        genres,
        cast,
        directors,
        country,
        tags,
      };

      const data = new MovieModel(movieData);

      const savedCategory = await data.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [PUT] api/movies/update/:id
  async update(req, res, next) {
    try {
      if (req.file) {
        const file = req.file;
        const uploadedFile = await uploadImageSingle(file);
        req.body.thumbnailUrl = uploadedFile;
      }

      const genres = JSON.parse(req.body.genres);
      const cast = JSON.parse(req.body.cast);
      const directors = JSON.parse(req.body.directors);
      const country = JSON.parse(req.body.country);
      const tags = JSON.parse(req.body.tags);

      const movieData = {
        ...req.body,
        genres,
        cast,
        directors,
        country,
        tags,
      };

      const data = await MovieModel.findByIdAndUpdate(req.params.id, { $set: movieData }, { new: true });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/movies/delete/:id
  async delete(req, res, next) {
    try {
      await MovieModel.delete({ _id: req.params.id });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/movies/delete-many
  async deleteMany(req, res, next) {
    const { ids } = req.body;
    try {
      await MovieModel.deleteMany({ _id: { $in: ids } });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [GET] api/movies/trash
  async getTrash(req, res, next) {
    try {
      const data = await MovieModel.findWithDeleted({
        deleted: true,
      });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [PATCH] api/movies/restore/:id
  async restore(req, res, next) {
    try {
      const data = await MovieModel.restore({ _id: req.params.id });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/movies/force/:id
  async forceDelete(req, res, next) {
    // try {
    await MovieModel.deleteOne({ _id: req.params.id });
    res.status(200).json('Deleted successfully');
    // } catch (error) {
    //   res.status(500).json(error.message);
    // }
  }
}

module.exports = new MovieController();

const mongoose = require('mongoose');
const GenreModel = require('../models/genre');

class GenreController {
  // [GET] api/genres
  async getQuery(req, res, next) {
    try {
      const query = Object.assign({}, req.query);
      const data = await GenreModel.find(query);
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
      const data = await GenreModel.findById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [POST] api/genres/store
  async create(req, res, next) {
    try {
      const data = new GenreModel(req.body);
      const savedCategory = await data.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ message: 'Duplicate key error', error });
      } else {
        res.status(500).json({ message: 'Server error', error });
      }
    }
  }

  // [PUT] api/genres/update/:id
  async update(req, res, next) {
    try {
      const data = await GenreModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [DELETE] api/genres/delete/:id
  async delete(req, res, next) {
    try {
      await GenreModel.delete({ _id: req.params.id });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [DELETE] api/genres/delete-many
  async deleteMany(req, res, next) {
    const { ids } = req.body;
    try {
      await GenreModel.deleteMany({ _id: { $in: ids } });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [GET] api/genres/trash
  async getTrash(req, res, next) {
    try {
      const data = await GenreModel.findDeleted();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [PATCH] api/genres/restore/:id
  async restore(req, res, next) {
    try {
      const data = await GenreModel.restore({ _id: req.params.id });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [DELETE] api/genres/force/:id
  async forceDelete(req, res, next) {
    try {
      await GenreModel.findByIdAndDelete(req.params.id);
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = new GenreController();

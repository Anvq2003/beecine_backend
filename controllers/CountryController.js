const mongoose = require('mongoose');
const CountryModel = require('../models/country');

class CountryController {
  // [GET] api/counties
  async getQuery(req, res, next) {
    try {
      const query = Object.assign({}, req.query);
      const data = await CountryModel.find(query);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [GET] api/counties/:id
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }
      const data = await CountryModel.findById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [POST] api/counties/store
  async create(req, res, next) {
    try {
      const data = new CountryModel(req.body);
      const savedCategory = await data.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [POST] api/counties/store-many
  async createMany(req, res, next) {
    try {
      const data = await CountryModel.insertMany(req.body);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [PUT] api/counties/update/:id
  async update(req, res, next) {
    try {
      const data = await CountryModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/countries/delete/:id
  async delete(req, res, next) {
    try {
      await CountryModel.delete({ _id: req.params.id });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/countries/delete-many
  async deleteMany(req, res, next) {
    const { ids } = req.body;
    try {
      await CountryModel.deleteMany({ _id: { $in: ids } });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [GET] api/countries/trash
  async getTrash(req, res, next) {
    try {
      const data = await CountryModel.findDeleted();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [PATCH] api/countries/restore/:id
  async restore(req, res, next) {
    try {
      const data = await CountryModel.restore({ _id: req.params.id });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  // [DELETE] api/countries/force/:id
  async forceDelete(req, res, next) {
    try {
      await CountryModel.findByIdAndDelete(req.params.id);
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new CountryController();

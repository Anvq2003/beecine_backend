const mongoose = require('mongoose');
const BillModel = require('../models/bill');

class BillController {
  // [GET] api/bills
  async getQuery(req, res) {
    try {
      const query = Object.assign({}, req.query);
      const data = await BillModel.find(query);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [GET] api/bills/:id
  async getOne(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }
      const data = await BillModel.findById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [POST] api/bills/store
  async create(req, res) {
    try {
      const data = new BillModel(req.body);
      const savedCategory = await data.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [POST] api/bills/store-many
  async createMany(req, res) {
    try {
      const data = await BillModel.insertMany(req.body);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [PUT] api/bills/update/:id
  async update(req, res) {
    try {
      const data = await BillModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [DELETE] api/bills/delete/:id
  async delete(req, res, next) {
    try {
      await BillModel.delete({ _id: req.params.id });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [DELETE] api/bills/delete-many
  async deleteMany(req, res, next) {
    const { ids } = req.body;
    try {
      await BillModel.deleteMany({ _id: { $in: ids } });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [GET] api/bills/trash
  async getTrash(req, res, next) {
    try {
      const data = await BillModel.findDeleted();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [PATCH] api/bills/restore/:id
  async restore(req, res, next) {
    try {
      const data = await BillModel.restore({ _id: req.params.id });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [DELETE] api/bills/force/:id
  async forceDelete(req, res, next) {
    try {
      await BillModel.findByIdAndDelete(req.params.id);
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = new BillController();

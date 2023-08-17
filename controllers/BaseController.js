const mongoose = require('mongoose');

class BaseController {
  constructor(model) {
    this.model = model;
  }

  async getAll(req, res, next) {
    try {
      const data = await this.model.findWithDeleted();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getQuery(req, res, next) {
    try {
      const query = Object.assign({}, req.query);
      const data = await this.model.find(query);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }
      const data = await this.model.findById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async create(req, res, next) {
    try {
      const data = new this.model(req.body);
      const savedData = await data.save();
      res.status(200).json(savedData);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async update(req, res, next) {
    try {
      const data = await this.model.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true },
      );

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async delete(req, res, next) {
    try {
      await this.model.delete({ _id: req.params.id });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  async deleteMany(req, res, next) {
    try {
      const { ids } = req.body;
      await this.model.delete({ _id: { $in: ids } });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getTrash(req, res, next) {
    try {
      const data = await this.model.findWithDeleted({
        deleted: true,
      });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async restore(req, res, next) {
    try {
      const data = await this.model.restore({ _id: req.params.id });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async forceDelete(req, res, next) {
    try {
      await this.model.findByIdAndDelete(req.params.id);
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async forceDeleteMany(req, res, next) {
    const { ids } = req.body;
    try {
      await this.model.deleteMany({ _id: { $in: ids } });
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = BaseController;

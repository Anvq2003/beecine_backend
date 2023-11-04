const mongoose = require("mongoose");

class BaseController {
  constructor(model) {
    this.model = model;
  }

  async getAdmin(req, res) {
    const { populate } = req.query;
    const newPopulate = populate.split(",").join(" ");
    try {
      const dataAndDelete = await this.model
        .findWithDeleted()
        .sort({ createdAt: -1 })
        .populate(newPopulate);
      const currentData = dataAndDelete.filter((item) => !item.deleted);
      const dataDeleted = dataAndDelete.filter((item) => item.deleted);
      const activeData = dataAndDelete.filter((item) => item.status);
      const inActiveData = dataAndDelete.filter((item) => !item.status);

      const data = {
        allData: currentData,
        trashData: dataDeleted,
        activeData: activeData,
        inActiveData: inActiveData,
      };
      return res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getQuery(req, res) {
    try {
      const options = req.paginateOptions;
      const data = await this.model.paginate({}, options);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getByParam(req, res) {
    try {
      const param = req.params.param;
      let data;

      if (mongoose.Types.ObjectId.isValid(param)) {
        data = await this.model.findById(param);
      } else {
        data = await this.model.findOne({ slug: param });
      }

      if (!data) {
        return res.status(404).json({ message: "Not found" });
      }

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async create(req, res) {
    try {
      const data = new this.model(req.body);
      const savedData = await data.save();
      res.status(200).json(savedData);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async update(req, res) {
    try {
      const pathsToPopulate = Object.keys(this.model.schema.paths).filter(
        (path) => path !== "_id" && path !== "__v",
      );
      const data = await this.model
        .findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        .populate(pathsToPopulate);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async changeStatus(req, res) {
    try {
      const data = await this.model.findById(req.params.id);
      if (!data) return res.status(404).json({ message: "Not found" });
      data.status = !data.status;
      await data.save();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async delete(req, res) {
    try {
      await this.model.delete({ _id: req.params.id });
      res.status(200).json({
        message: "Deleted successfully",
        _id: req.params.id,
      });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async deleteMany(req, res) {
    try {
      const { ids } = req.body;
      console.debug("🚀 ~ ids:", ids);
      await this.model.delete({ _id: { $in: ids } });
      res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getTrash(req, res) {
    try {
      const data = await this.model.findWithDeleted({
        deleted: true,
      });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async restore(req, res) {
    try {
      const data = await this.model.restore({ _id: req.params.id });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async restoreMany(req, res) {
    try {
      const { ids } = req.body;
      const data = await this.model.restore({ _id: { $in: ids } });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async forceDelete(req, res) {
    try {
      await this.model.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async forceDeleteMany(req, res) {
    const { ids } = req.body;
    try {
      await this.model.deleteMany({ _id: { $in: ids } });
      res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = BaseController;

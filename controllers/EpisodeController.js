const EpisodeModel = require('../models/episode');
const BaseController = require('./BaseController');
const _ = require('lodash');
class EpisodeController extends BaseController {
  constructor() {
    super(EpisodeModel);
  }

  // async getAdmin(req, res) {
  //   try {
  //     const { id } = req.params;
  //     const { field = 'all', value = 'all', season = 1 } = req.query;
  //     const options = req.paginateOptions;
  //     options.sort = { createdAt: -1 };
  //     options.populate = Object.keys(this.model.schema.paths).filter(
  //       (path) => path !== '_id' && path !== '__v',
  //     );

  //     const allData = await this.model
  //       .findWithDeleted({ $and: [{ movieId: id }, { season: season }] })
  //       .populate(options.populate);
  //     const count = {
  //       all: _.filter(allData, (item) => !item.deleted).length,
  //       active: _.filter(allData, (item) => item.status).length,
  //       inactive: _.filter(allData, (item) => !item.status).length,
  //       trash: _.filter(allData, (item) => item.deleted).length,
  //     };

  //     if (field === 'deleted' && value === 'true') {
  //       let data = await this.model
  //         .findWithDeleted({ $and: [{ movieId: id }, { season: season }, { deleted: true }] })
  //         .populate(options.populate);
  //       const totalResults = data.length;
  //       const totalPages = Math.ceil(totalResults / options.limit);
  //       const page = options.page;
  //       const hasPrevPage = page > 1;
  //       const hasNextPage = page < totalPages;
  //       const skip = (page - 1) * options.limit;
  //       data = data.slice(skip, skip + options.limit);

  //       const info = {
  //         totalResults,
  //         totalPages,
  //         page,
  //         hasPrevPage,
  //         hasNextPage,
  //       };
  //       return res.status(200).json({ data, info, count });
  //     }

  //     // Get all data
  //     if (field === 'all' && value === 'all') {
  //       const data = await this.model.paginate(
  //         { $and: [{ movieId: id }, { season: season }] },
  //         options,
  //       );
  //       return res.status(200).json({ ...data, count });
  //     }
  //   } catch (error) {
  //     res.status(500).json(error.message);
  //   }
  // }

  async getByMovieId(req, res) {
    try {
      const { id } = req.params;
      const { season = 1 } = req.query;
      if (!id) return res.status(400).json('Movie id is required');

      const episode = await EpisodeModel.find({ movieId: id, season });
      if (!episode) return res.status(404).json('Episode not found');
      res.status(200).json(episode);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new EpisodeController();

const mongoose = require('mongoose');
const MovieModel = require('../models/movie');
const UserModel = require('../models/user');
const GenreModel = require('../models/genre');
const BillModel = require('../models/bill');

class CommonController {
  async stats(req, res) {
    try {
      const totalMovies = await MovieModel.countDocuments();
      const totalViews = await MovieModel.aggregate([
        {
          $group: {
            _id: null,
            totalViews: { $sum: '$views' },
          },
        },
      ]);
      const totalUsers = await UserModel.countDocuments({ role: 'USER' });
      const totalGenres = await GenreModel.countDocuments();

      res.json({
        totalMovies,
        totalViews: totalViews.length > 0 ? totalViews[0].totalViews : 0,
        totalUsers,
        totalGenres,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTopMovie(req, res) {
    const { limit = 3, period = 'day' } = req.query;
    // period = day | week | month | year

    try {
      let movies = [];
      switch (period) {
        case 'day':
          movies = await MovieModel.aggregate([
            {
              $project: {
                title: 1,
                totalViews: '$views',
                lastUpdated: '$updatedAt',
              },
            },
            {
              $project: {
                title: 1,
                viewsPerPeriod: {
                  $map: {
                    input: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                    as: 'hourAgo',
                    in: {
                      value: {
                        $floor: {
                          $divide: ['$totalViews', { $subtract: [12, '$$hourAgo'] }],
                        },
                      },
                      label: {
                        $concat: [{ $toString: { $subtract: [12, '$$hourAgo'] } }, 'h'],
                      },
                    },
                  },
                },
              },
            },
            {
              $sort: {
                'viewsPerPeriod.0': -1,
              },
            },
            {
              $limit: 3,
            },
          ]);
          break;
        case 'week':
          movies = await MovieModel.aggregate([
            {
              $project: {
                title: 1,
                totalViews: '$views',
                lastUpdated: '$updatedAt',
              },
            },
            {
              $project: {
                title: 1,
                viewsPerWeek: {
                  $map: {
                    input: [0, 1, 2, 3, 4, 5, 6],
                    as: 'dayAgo',
                    in: {
                      value: {
                        $floor: {
                          $divide: ['$totalViews', { $subtract: [7, '$$dayAgo'] }],
                        },
                      },
                      label: {
                        $switch: {
                          branches: [
                            { case: { $eq: ['$$dayAgo', 0] }, then: 'Mon' },
                            { case: { $eq: ['$$dayAgo', 1] }, then: 'Tue' },
                            { case: { $eq: ['$$dayAgo', 2] }, then: 'Wed' },
                            { case: { $eq: ['$$dayAgo', 3] }, then: 'Thu' },
                            { case: { $eq: ['$$dayAgo', 4] }, then: 'Fri' },
                            { case: { $eq: ['$$dayAgo', 5] }, then: 'Sat' },
                            { case: { $eq: ['$$dayAgo', 6] }, then: 'Sun' },
                          ],
                        },
                      },
                    },
                  },
                },
              },
            },
            {
              $sort: {
                'viewsPerWeek.0': -1,
              },
            },
            {
              $limit: 3,
            },
          ]);
        case 'month':
          movies = await MovieModel.aggregate([
            {
              $project: {
                title: 1,
                totalViews: '$views',
                lastUpdated: '$updatedAt',
              },
            },
            {
              $project: {
                title: 1,
                viewsPerMonth: {
                  $map: {
                    input: Array.from({ length: 31 }, (_, i) => i),
                    as: 'dayAgo',
                    in: {
                      value: {
                        $floor: {
                          $divide: ['$totalViews', { $subtract: [31, '$$dayAgo'] }],
                        },
                      },
                      label: {
                        $toString: { $add: [1, '$$dayAgo'] },
                      },
                    },
                  },
                },
              },
            },
            {
              $sort: {
                'viewsPerMonth.0': -1,
              },
            },
            {
              $limit: 3,
            },
          ]);
          break;
      }

      res.status(200).json(movies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // async getTopMovie(req, res) {
  //   const { limit = 3, period = 'day' } = req.query;

  //   const buildLabel = (periodCount, index) => {
  //     const idx = parseInt(index);
  //     const diff = periodCount - idx;
  //     return `${diff}${period === 'day' ? 'h' : period.charAt(0)}`;
  //   };

  //   const periodsMap = {
  //     day: 12,
  //     week: 7,
  //     month: 30, // có thể tùy chỉnh
  //     year: 12,
  //   };

  //   try {
  //     const pipeline = [
  //       {
  //         $project: {
  //           title: 1,
  //           totalViews: '$views',
  //           lastUpdated: '$updatedAt',
  //         },
  //       },
  //       {
  //         $project: {
  //           title: 1,
  //           viewsPerPeriod: {
  //             $map: {
  //               input: Array.from({ length: periodsMap[period] }, (_, i) => i),
  //               as: 'index',
  //               in: {
  //                 label: buildLabel(periodsMap[period], '$$index'),
  //                 value: {
  //                   $floor: {
  //                     $divide: ['$totalViews', periodsMap[period]],
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //       {
  //         $sort: {
  //           'viewsPerPeriod.0': -1,
  //         },
  //       },
  //       {
  //         $group: {
  //           _id: '$title',
  //           viewsPerPeriod: { $first: '$viewsPerPeriod' },
  //         },
  //       },
  //       { $limit: limit },
  //       // {
  //       //   $lookup: {
  //       //     from: 'movies',
  //       //     localField: '_id',
  //       //     foreignField: '_id',
  //       //     as: 'movieDetail',
  //       //   },
  //       // },
  //       // { $unwind: '$movieDetail' },
  //       // {
  //       //   $project: {
  //       //     title: '$movieDetail.title',
  //       //     viewsPerPeriod: 1,
  //       //     poster: '$movieDetail.poster',
  //       //   },
  //       // },
  //     ];

  //     let movies = await MovieModel.aggregate(pipeline);
  //     return res.json(movies);
  //   } catch (e) {
  //     res.status(500).json({ error: e.message });
  //   }
  // }

  async getTopGenre(req, res) {
    const { limit = 5, period = 'month' } = req.query;
    // period = month | year
    try {
      const genres = await GenreModel.aggregate([
        {
          $lookup: {
            from: 'movies',
            localField: '_id',
            foreignField: 'genres',
            as: 'movies',
          },
        },
        {
          $unwind: '$movies',
        },
        {
          $match: {
            'movies.createdAt': {
              $gte:
                period === 'month'
                  ? new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                  : new Date(new Date().getFullYear(), 0, 1),
            },
          },
        },
        {
          $group: {
            _id: '$_id',
            name: { $first: '$name' },
            movies: { $push: '$movies' },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            totalViews: { $sum: '$movies.views' },
          },
        },
        {
          $sort: {
            totalViews: -1,
          },
        },
        {
          $limit: parseInt(limit),
        },
      ]);
      res.json(genres);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTopUser(req, res) {
    const { limit = 7, period = 'month' } = req.query;
    // period = month | year
    try {
      const users = await UserModel.aggregate([
        {
          $match: {
            role: 'USER',
            createdAt: {
              $gte:
                period === 'month'
                  ? new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                  : new Date(new Date().getFullYear(), 0, 1),
            },
          },
        },
        {
          $sort: {
            'checkIn.points': -1,
          },
        },
        {
          $limit: parseInt(limit),
        },
      ]);
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProfit(req, res) {
    // const { period = 'day' } = req.query;
    try {
      const data = await BillModel.aggregate([
        {
          $match: {
            status: 'active',
          },
        },
        {
          $lookup: {
            from: 'subscriptions',
            localField: 'subscriptionId',
            foreignField: '_id',
            as: 'subscription',
          },
        },
        { $unwind: '$subscription' },
        {
          $project: {
            revenue: { $multiply: ['$total', 7] },
            weekStart: { $isoWeek: '$startDate' },
          },
        },
        {
          $group: {
            _id: '$weekStart',
            revenue: { $sum: '$revenue' },
          },
        },
        { $sort: { _id: -1 } },
        { $limit: 1 },
        {
          $project: {
            _id: 0,
            week: {
              $concat: [{ $toString: '$_id' }, ' - tuần ', { $toString: { $isoWeek: new Date() } }],
            },
            revenue: 1,
          },
        },
      ]);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CommonController();

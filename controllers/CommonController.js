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
    // period = day | week | month

    try {
      let movies = [];
      switch (period) {
        case 'day':
          // get top 3 movies in day data is { label: '1h', value: 1000, movie: { ... } }
          movies = await MovieModel.aggregate([
            {
              $project: {
                title: 1,
                viewsPerHour: {
                  $slice: ['$viewsPerHour', -12],
                },
              },
            },
            {
              $sort: {
                'viewsPerHour.value': -1,
              },
            },
            {
              $group: {
                _id: '$title',
                viewsPerHour: { $first: '$viewsPerHour' },
              },
            },
            {
              $limit: 3,
            },
          ]);
      }
      res.status(200).json(movies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

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
            points: -1,
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
    const { period = 'day' } = req.query;
    // period =  week | month | year
    // the result if week : [{label: 'Mon', value: 1000}, {label: 'Tue', value: 2000}, ...]
    // the result if month : [{label: '1', value: 1000}, {label: '2', value: 2000}, ...]
    // the result if year : [{label: 'Jan', value: 1000}, {label: 'Feb', value: 2000}, ...]

    // if some field is null, we will fill it with 0
    try {
      // const bills = await BillModel.aggregate([
      //   {
      //     $match: {
      //       createdAt: {
      //         $gte: dayjs().subtract(1, period).toDate(),
      //       },
      //     },
      //   },
      //   {
      //     $project: {
      //       createdAt: 1,
      //       total: 1,
      //     },
      //   },
      //   {
      //     $sort: {
      //       createdAt: 1,
      //     },
      //   },
      //   {
      //     $group: {
      //       _id: {
      //         $dateToString: {
      //           date: '$createdAt',
      //           format: period === 'week' ? '%w' : period === 'month' ? '%d' : '%m',
      //         },
      //       },
      //       total: { $sum: '$total' },
      //     },
      //   },
      //   {
      //     $project: {
      //       _id: 0,
      //       label: '$_id',
      //       value: '$total',
      //     },
      //   },
      // ]);

      // const labels =
      //   period === 'week'
      //     ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      //     : period === 'month'
      //     ? Array.from({ length: 31 }, (_, i) => i + 1)
      //     : period === 'year'
      //     ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
      //     : [];
      // const result = labels.map((label) => {
      //   const bill = bills.find((bill) => bill.label === label);
      //   return {
      //     label,
      //     value: bill ? bill.value : 0,
      //   };
      // });
      const result = [];
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CommonController();

const mongoose = require('mongoose');
const MovieModel = require('../models/movie');
const UserModel = require('../models/user');
const GenreModel = require('../models/genre');
const BillModel = require('../models/bill');
const moment = require('moment');

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
    const { limit = 10, period = 'day' } = req.query;
    // period = day | week | month | year

    let time = moment().startOf('day').toDate();
    try {
      switch (period) {
        case 'day':
          time = moment().startOf('day').toDate();
          break;
        case 'week':
          time = moment().startOf('week').toDate();
          break;
        case 'month':
          time = moment().startOf('month').toDate();
          break;
        case 'year':
          time = moment().startOf('year').toDate();
          break;

      }

      const movies = await MovieModel.aggregate(
        [
          { $match: { updatedAt: { $gte: time } } },
          { $project: { _id: 1, title: 1, imageUrl: 1, views: 1 } },
          { $sort: { views: -1 } },
          { $limit: parseInt(limit) },
        ]
      );
      movies.reverse();
      res.status(200).json(movies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTopGenre(req, res) {
    const { limit = 5, period = 'week' } = req.query;
    // period = month | year

    let pipeline = [];
    try {
      switch (period) {
        case 'week':
          pipeline = [
            {
              $lookup: { from: 'movies', localField: '_id', foreignField: 'genres', as: 'movies' },
            },
            { $unwind: '$movies' },
            { $match: { 'movies.createdAt': { $gte: moment().startOf('week').toDate() } } },
            { $group: { _id: '$_id', name: { $first: '$name' }, movies: { $push: '$movies' } } },
            { $project: { _id: 1, name: 1, totalViews: { $sum: '$movies.views' } } },
            { $sort: { totalViews: -1 } },
            { $limit: parseInt(limit) },
          ];
          break;

        case 'month':
          pipeline = [
            {
              $lookup: { from: 'movies', localField: '_id', foreignField: 'genres', as: 'movies' },
            },
            { $unwind: '$movies' },
            { $match: { 'movies.createdAt': { $gte: moment().startOf('month').toDate() } } },
            { $group: { _id: '$_id', name: { $first: '$name' }, movies: { $push: '$movies' } } },
            { $project: { _id: 1, name: 1, totalViews: { $sum: '$movies.views' } } },
            { $sort: { totalViews: -1 } },
            { $limit: parseInt(limit) },
          ];
          break;

        case 'year':
          pipeline = [
            {
              $lookup: { from: 'movies', localField: '_id', foreignField: 'genres', as: 'movies' },
            },
            { $unwind: '$movies' },
            { $match: { 'movies.createdAt': { $gte: moment().startOf('year').toDate() } } },
            { $group: { _id: '$_id', name: { $first: '$name' }, movies: { $push: '$movies' } } },
            { $project: { _id: 1, name: 1, totalViews: { $sum: '$movies.views' } } },
            { $sort: { totalViews: -1 } },
            { $limit: parseInt(limit) },
          ];
          break;
        default:
          break;
      }

      const genres = await GenreModel.aggregate(pipeline);
      res.status(200).json(genres);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTopUser(req, res) {
    const { limit = 7, period = 'week' } = req.query;
    // period = month | year
    // get top user has total check in the most sortby (totalCheckIns,points, checkInStreak)
    // data of user: { _id, name, email, checkIn: [{ points, totalCheckIns, checkInStreak, ... }] }
    let pipeline = [];

    try {
      switch (period) {
        case 'week':
          pipeline = [
            { $match: { role: 'USER' } },
            { $project: { _id: 1, name: 1, email: 1, checkIn: 1 } },
            { $unwind: '$checkIn' },
            { $match: { 'checkIn.lastCheckIn': { $gte: moment().startOf('week').toDate() } } },
            {
              $group: {
                _id: '$_id',
                name: { $first: '$name' },
                email: { $first: '$email' },
                imageUrl: { $first: '$imageUrl' },
                checkIn: { $push: '$checkIn' },
              },
            },
            { $project: { _id: 1, name: 1, email: 1, imageUrl: 1, checkIn: 1 } },
            { $sort: { 'checkIn.totalCheckIns': -1 } },
            { $limit: parseInt(limit) },
          ];
          break;
        case 'month':
          pipeline = [
            { $match: { role: 'USER' } },
            { $project: { _id: 1, name: 1, email: 1, checkIn: 1 } },
            { $unwind: '$checkIn' },
            { $match: { 'checkIn.lastCheckIn': { $gte: moment().startOf('month').toDate() } } },
            {
              $group: {
                _id: '$_id',
                name: { $first: '$name' },
                email: { $first: '$email' },
                imageUrl: { $first: '$imageUrl' },
                checkIn: { $push: '$checkIn' },
              },
            },
            { $project: { _id: 1, name: 1, email: 1, imageUrl: 1, checkIn: 1 } },
            { $sort: { 'checkIn.totalCheckIns': -1 } },
            { $limit: parseInt(limit) },
          ];

          break;
        case 'year':
          pipeline = [
            { $match: { role: 'USER' } },
            { $project: { _id: 1, name: 1, email: 1, checkIn: 1 } },
            { $unwind: '$checkIn' },
            { $match: { 'checkIn.lastCheckIn': { $gte: moment().startOf('year').toDate() } } },
            {
              $group: {
                _id: '$_id',
                name: { $first: '$name' },
                email: { $first: '$email' },
                imageUrl: { $first: '$imageUrl' },
                checkIn: { $push: '$checkIn' },
              },
            },
            { $project: { _id: 1, name: 1, email: 1, imageUrl: 1, checkIn: 1 } },
            { $sort: { 'checkIn.totalCheckIns': -1 } },
            { $limit: parseInt(limit) },
          ];
          break;
      }

      const users = await UserModel.aggregate(pipeline);
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProfit(req, res) {
    const { period = 'week', limit = 7 } = req.query;
    try {
      // get profit by week
      // result = [{ label: 'Tuần hiện tại', value: 1000000đ }, { label: 'Tuần trước', value: 2000000đ }, ...]
      // [label] = 'Tuần ' + [week] + ' - ' + [month]
      // subscription : { _id, name, price, duration, benefits, isFeatured, languages, status }
      // bill:  { _id, userId ,subscriptionId ,startDate, endDate , total

      let pipeline = [];
      switch (period) {
        case 'week':
          pipeline = [
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
                _id: 1,
                userId: 1,
                subscriptionId: 1,
                startDate: 1,
                endDate: 1,
                total: 1,
                subscription: {
                  _id: 1,
                  name: 1,
                  price: 1,
                  duration: 1,
                  benefits: 1,
                  isFeatured: 1,
                  languages: 1,
                  status: 1,
                },
              },
            },
            { $match: { startDate: { $gte: new Date(new Date().getFullYear(), 0, 1) } } },
            {
              $group: {
                _id: {
                  week: { $week: '$startDate' },
                  month: { $month: '$startDate' },
                  year: { $year: '$startDate' },
                },
                total: { $sum: '$total' },
              },
            },
            {
              $project: {
                _id: 0,
                label: {
                  $concat: [
                    'Tuần ',
                    { $toString: '$_id.week' },
                    ' - ',
                    { $toString: '$_id.month' },
                  ],
                },
                value: '$total',
              },
            },
            { $sort: { label: -1 } },
          ];
            
          break;
        case 'month':
          pipeline = [
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
                _id: 1,
                userId: 1,
                subscriptionId: 1,
                startDate: 1,
                endDate: 1,
                total: 1,
                subscription: {
                  _id: 1,
                  name: 1,
                  price: 1,
                  duration: 1,
                  benefits: 1,
                  isFeatured: 1,
                  languages: 1,
                  status: 1,
                },
              },
            },
            { $match: { startDate: { $gte: new Date(new Date().getFullYear(), 0, 1) } } },
            {
              $group: {
                _id: { month: { $month: '$startDate' }, year: { $year: '$startDate' } },
                total: { $sum: '$total' },
              },
            },
            {
              $project: {
                _id: 0,
                label: { $concat: ['Tháng ', { $toString: '$_id.month' }] },
                value: '$total',
              },
            },
            { $sort: { label: -1 } },
          ];
          break;
        case 'year':
          pipeline = [
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
                _id: 1,
                userId: 1,
                subscriptionId: 1,
                startDate: 1,
                endDate: 1,
                total: 1,
                subscription: {
                  _id: 1,
                  name: 1,
                  price: 1,
                  duration: 1,
                  benefits: 1,
                  isFeatured: 1,
                  languages: 1,
                  status: 1,
                },
              },
            },
            { $match: { startDate: { $gte: new Date(new Date().getFullYear(), 0, 1) } } },
            { $group: { _id: { year: { $year: '$startDate' } }, total: { $sum: '$total' } } },
            {
              $project: {
                _id: 0,
                label: { $concat: ['Năm ', { $toString: '$_id.year' }] },
                value: '$total',
              },
            },
            { $sort: { label: -1 } },
          ];
          break;

        default:
          break;
      }
      const data = await BillModel.aggregate(pipeline);
      data.reverse();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

}

module.exports = new CommonController();

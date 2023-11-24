const BaseController = require('./BaseController');
const UserModel = require('../models/user');
const MovieModel = require('../models/movie');
const _ = require('lodash');
const admin = require('firebase-admin');

class UserController extends BaseController {
  constructor() {
    super(UserModel);
  }

  async checkIn(req, res) {
    try {
      const user = req.user;

      if (user.lastCheckIn && user.lastCheckIn.toDateString() === new Date().toDateString()) {
        return res.json({ message: 'Already checked in today' });
      }

      user.lastCheckIn = new Date();
      user.checkInStreak++; 
      user.totalCheckIns++;

      const streakBonus = user.checkInStreak * 5;

      user.points += streakBonus;

      await user.save();

      res.json(user);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getFavoriteMovies(req, res) {
    try {
      const userId = req.params.id;
      const options = req.paginateOptions;

      let user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user = await user.populate({
        path: 'favoriteMovies.movieId',
        model: 'Movie',
        populate: [
          { path: 'genres', model: 'Genre', select: 'name slug' },
          { path: 'country', model: 'Country', select: 'name slug' },
          { path: 'directors', model: 'Artist', select: 'name slug' },
          { path: 'cast', model: 'Artist', select: 'name slug' },
        ],
      });

      user.favoriteMovies.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      const paginatedFavoriteMovies = user.favoriteMovies.slice(
        (options.page - 1) * options.limit,
        options.page * options.limit,
      );

      const favoriteMovies = paginatedFavoriteMovies.map((item) => {
        return _.merge(item.movieId, { createdItemAt: item.createdAt });
      });

      res.status(200).json({
        data: favoriteMovies,
        info: {
          totalResults: user.favoriteMovies.length,
          limit: options.limit,
          totalPages: Math.ceil(user.favoriteMovies.length / options.limit),
          page: options.page,
          hasPrevPage: options.page > 1,
          hasNextPage: options.page < Math.ceil(user.favoriteMovies.length / options.limit),
        },
      });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getWatchedList(req, res) {
    try {
      const userId = req.params.id;
      const options = req.paginateOptions;

      let user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user = await user.populate([
        {
          path: 'watchedList.movieId',
          model: 'Movie',
          populate: [
            { path: 'genres', model: 'Genre', select: 'name slug' },
            { path: 'country', model: 'Country', select: 'name slug' },
            { path: 'directors', model: 'Artist', select: 'name slug' },
            { path: 'cast', model: 'Artist', select: 'name slug' },
          ],
        },
        {
          path: 'watchedList.episodeId',
          model: 'Episode',
        },
      ]);

      user.watchedList.sort((a, b) => {
        return new Date(b.watchedAt) - new Date(a.watchedAt);
      });

      const paginatedWatchedList = user.watchedList.slice(
        (options.page - 1) * options.limit,
        options.page * options.limit,
      );

      const watchedList = paginatedWatchedList.map((item) => {
        return _.merge(item.movieId, {
          minutes: item.minutes,
          createdItemAt: item.watchedAt,
          episodeInfo: item.episodeId,
        });
      });

      res.status(200).json({
        data: watchedList,
        info: {
          totalResults: user.watchedList.length,
          limit: options.limit,
          totalPages: Math.ceil(user.watchedList.length / options.limit),
          page: options.page,
          hasPrevPage: options.page > 1,
          hasNextPage: options.page < Math.ceil(user.watchedList.length / options.limit),
        },
      });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getWatchLaterList(req, res) {
    try {
      const userId = req.params.id;
      const options = req.paginateOptions;
      let user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user = await user.populate({
        path: 'watchLaterList.movieId',
        model: 'Movie',
        populate: [
          { path: 'genres', model: 'Genre', select: 'name slug' },
          { path: 'country', model: 'Country', select: 'name slug' },
          { path: 'directors', model: 'Artist', select: 'name slug' },
          { path: 'cast', model: 'Artist', select: 'name slug' },
        ],
      });

      user.watchLaterList.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      const paginatedWatchLaterList = user.watchLaterList.slice(
        (options.page - 1) * options.limit,
        options.page * options.limit,
      );

      const watchLaterList = paginatedWatchLaterList.map((item) => {
        return _.merge(item.movieId, { createdItemAt: item.createdAt });
      });

      res.status(200).json({
        data: watchLaterList,
        info: {
          totalResults: user.watchLaterList.length,
          limit: options.limit,
          totalPages: Math.ceil(user.watchLaterList.length / options.limit),
          page: options.page,
          hasPrevPage: options.page > 1,
          hasNextPage: options.page < Math.ceil(user.watchLaterList.length / options.limit),
        },
      });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async createFavorite(req, res) {
    const { movieId, userId } = req.body;
    try {
      if (!movieId || !userId) {
        return res.status(400).json({ message: 'MovieId or userId is required' });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const movie = MovieModel.findById(movieId);
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }

      const exist = user.favoriteMovies.find((item) => item.movieId == movieId);
      if (exist) {
        user.favoriteMovies = user.favoriteMovies.filter((item) => item.movieId != movieId);
      } else {
        user.favoriteMovies.push({
          movieId: movieId,
          createdAt: Date.now(),
        });
      }
      await user.save();
      res.status(200).json(user.favoriteMovies);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async createWatched(req, res) {
    const { movieId, episodeId = null, userId, minutes } = req.body;
    try {
      if (!movieId || !userId || !minutes) {
        return res.status(400).json({ message: 'MovieId, episodeId, userId, minutes is required' });
      }

      const user = await UserModel.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const movie = MovieModel.findById(movieId);
      if (!movie) return res.status(404).json({ message: 'Movie not found' });

      const index = user.watchedList.findIndex((item) => item.movieId == movieId);
      if (index !== -1) {
        user.watchedList[index].episodeId = episodeId;
        user.watchedList[index].minutes = minutes;
        user.watchedList[index].watchedAt = Date.now();
      } else {
        user.watchedList.push({
          movieId: movieId,
          episodeId: episodeId,
          minutes: minutes,
          watchedAt: Date.now(),
        });
      }
      const savedData = await user.save();
      res.status(200).json(savedData.watchedList);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async createWatchLater(req, res) {
    try {
      const { movieId, userId } = req.body;
      if (!movieId || !userId) {
        return res.status(400).json({ message: 'MovieId or userId is required' });
      }
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const movie = await MovieModel.findById(movieId);
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }

      const exist = user.watchLaterList.find((item) => item.movieId == movieId);
      if (exist) {
        user.watchLaterList = user.watchLaterList.filter((item) => item.movieId != movieId);
      } else {
        user.watchLaterList.push({
          movieId: movieId,
          createdAt: Date.now(),
        });
      }

      const savedData = await user.save();
      res.status(200).json(savedData.watchLaterList);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async deleteManyByType(req, res) {
    const { userId, type, ids } = req.body;
    try {
      if (!userId || !type) {
        return res.status(400).json({ message: 'UserId or type is required' });
      }
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      switch (type) {
        case 'FAVORITE':
          user.favoriteMovies = user.favoriteMovies.filter(
            (item) => !ids.includes(item.movieId.toString()),
          );
          user.save();
          res.status(200).json(user.favoriteMovies);
          break;
        case 'WATCHED':
          user.watchedList = user.watchedList.filter(
            (item) => !ids.includes(item.movieId.toString()),
          );
          user.save();
          res.status(200).json(user.watchedList);
          break;
        case 'WATCH_LATER':
          user.watchLaterList = user.watchLaterList.filter(
            (item) => !ids.includes(item.movieId.toString()),
          );
          user.save();
          res.status(200).json(user.watchLaterList);
          break;
        default:
          break;
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async checkEmail(req, res) {
    try {
      const email = req.params.email;
      const existEmail = await UserModel.findOne({ email: email });
      res.status(200).json(existEmail ? true : false);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async createAdmin(req, res) {
    try {
      const { email, password, name } = req.body;
      const user = await admin.auth().createUser({
        email: email,
        password: password,
      });
      await admin.auth().setCustomUserClaims(user.uid, { admin: true });
      await admin.auth().updateUser(user.uid, { displayName: name });

      const data = new UserModel({ ...req.body, uid: user.uid });
      const savedData = await data.save();
      res.status(200).json(savedData);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new UserController();

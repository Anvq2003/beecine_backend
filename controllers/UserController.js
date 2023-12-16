const BaseController = require('./BaseController');
const UserModel = require('../models/user');
const MovieModel = require('../models/movie');
const _ = require('lodash');
const admin = require('firebase-admin');
const moment = require('moment');

class UserController extends BaseController {
  constructor() {
    super(UserModel);
  }

  getPoints(stress) {
    // Check-in 1-3 ngày liên tiếp: 5 điểm/ngày
    // Check-in 4-6 ngày liên tiếp: 10 điểm/ngày
    // Check-in 7+ ngày liên tiếp: 15 điểm/ngày
    let pointsEarned = 5;

    if (stress >= 4 && stress <= 6) {
      pointsEarned = 10;
    } else if (stress >= 7) {
      pointsEarned = 15;
    }

    return pointsEarned;
  }

  getCurrentWeek() {
    // lấy tuần hiện tại từ thứ 2 đến chủ nhật
    const today = new Date();
    const currentWeek = [];
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    const endOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek + 1);
    endOfWeek.setDate(today.getDate() - dayOfWeek + 7);

    for (let i = startOfWeek.getDate(); i <= endOfWeek.getDate(); i++) {
      currentWeek.push(new Date(startOfWeek.setDate(i)));
    }

    return currentWeek;
  }

  isCheckedInToday(lastCheckIn) {
    const today = new Date();
    return (
      lastCheckIn &&
      lastCheckIn.toDateString() === new Date(today.setDate(today.getDate())).toDateString()
    );
  }

  async checkIn(req, res) {
    try {
      const user = await UserModel.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const checkIn = user.checkIn;

      if (this.isCheckedInToday(checkIn.lastCheckIn)) {
        return res.status(400).json({ message: 'You have already checked in today' });
      } else
       if (
        checkIn.lastCheckIn &&
        checkIn.lastCheckIn.toDateString() ===
          new Date(new Date().setDate(new Date().getDate() - 1)).toDateString()
      ) {
        checkIn.checkInStreak += 1;
      } else {
        checkIn.checkInStreak = 1;
      }

      checkIn.lastCheckIn = new Date();
      checkIn.totalCheckIns += 1;
      checkIn.points += this.getPoints(checkIn.checkInStreak);
      checkIn?.checkInHistory?.push({
        date: new Date(),
        points: this.getPoints(checkIn.checkInStreak),
      });
      await user.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getStatusCurrentWeek(req, res) {
    try {
      const user = await UserModel.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const checkIn = user.checkIn;
      const daysOfWeek = this.getCurrentWeek();
      let streakTemp = checkIn.checkInStreak;

      const currentWeek = daysOfWeek.reduce((acc, day) => {
        const record = checkIn?.checkInHistory?.find((r) => r.date.getDate() === day.getDate());
        let points = 0;

        if (record) {
          points = record.points;
        } else if (day.getTime() < new Date().getTime()) {
          points = 0;
          streakTemp = 0;
        } else {
          streakTemp += 1;
          points = this.getPoints(streakTemp);
        }
        acc.push({
          date: day,
          label: new Date(day).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(),
          checkIn: record ? true : false,
          points: points,
        });
        return acc;
      }, []);

      res.status(200).json(currentWeek);
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
          time: item.time,
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
    const { movieId, episodeId = null, userId, time = 0 } = req.body;
    try {
      if (!movieId || !userId) {
        return res.status(400).json({ message: 'MovieId, episodeId, userId, time is required' });
      }

      const user = await UserModel.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const movie = MovieModel.findById(movieId);
      if (!movie) return res.status(404).json({ message: 'Movie not found' });

      const index = user.watchedList.findIndex((item) => item.movieId == movieId);
      if (index !== -1) {
        user.watchedList[index].episodeId = episodeId;
        user.watchedList[index].time = time;
        user.watchedList[index].watchedAt = Date.now();
      } else {
        user.watchedList.push({
          movieId: movieId,
          episodeId: episodeId,
          time: time,
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

  async checkEmailOtp(req, res) {
    try {
      const email = req.params.email;
      const user = await UserModel.findOne({ email: email });
      res.status(200).json(user);
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

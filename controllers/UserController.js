const BaseController = require('./BaseController');
const UserModel = require('../models/user');
const MovieModel = require('../models/movie');

class UserController extends BaseController {
  constructor() {
    super(UserModel);
  }

  async getFavoriteMovies(req, res) {
    try {
      const userId = req.params.id;
      let user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user = await user.populate({
        path: 'favoriteMovies.movieId',
        model: 'Movie',
      });

      const favoriteMovies = user.favoriteMovies.map((item) => {
        return {
          _id: item._id,
          movieInfo: item.movieId,
          favoriteAt: item.createdAt,
        };
      });

      favoriteMovies.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      res.status(200).json(favoriteMovies);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getWatchedList(req, res) {
    try {
      const userId = req.params.id;
      let user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user = await user.populate([
        {
          path: 'watchedList.movieId',
          model: 'Movie',
        },
        {
          path: 'watchedList.episodeId',
          model: 'Episode',
        },
      ]);

      const watchedList = user.watchedList.map((item) => {
        return {
          _id: item._id,
          movieInfo: item.movieId,
          episodeInfo: item.episodeId,
          minutes: item.minutes,
          watchedAt: item.watchedAt,
        };
      });

      watchedList.sort((a, b) => {
        return new Date(b.watchedAt) - new Date(a.watchedAt);
      });
      res.status(200).json(watchedList);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getWatchLaterList(req, res) {
    try {
      const userId = req.params.id;
      let user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user = await user.populate({
        path: 'watchLaterList.movieId',
        model: 'Movie',
      });

      const watchLaterList = user.watchLaterList.map((item) => {
        return {
          _id: item._id,
          movieInfo: item.movieId,
          createdAt: item.createdAt,
        };
      });

      watchLaterList.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      res.status(200).json(watchLaterList);
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
      const isNull = user.favoriteMovies.length === 0;
      res.status(200).json({
        message: isNull ? 'Delete successfully' : 'Add successfully',
      });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async createWatched(req, res) {
    const { movieId, episodeId = null, userId, minutes } = req.body;
    try {
      if (!movieId || !userId || !episodeId || !minutes) {
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
      res.status(200).json({ message: 'Add successfully', data: savedData.watchedList });
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
      res.status(200).json({ message: 'Add successfully', data: savedData.watchLaterList });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async checkEmail(req, res) {
    try {
      const email = req.params.id;
      const existEmail = UserModel.findOne({ email: email });
      res.status(200).json(existEmail ? true : false);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new UserController();

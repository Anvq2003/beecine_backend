const BaseController = require('./BaseController');
const UserModel = require('../models/user');
const MovieModel = require('../models/movie');
const admin = require('firebase-admin');

class UserController extends BaseController {
  constructor() {
    super(UserModel);
  }

  async getByUid(req, res) {
    try {
      const uid = req.params.id;
      const user = await UserModel.findOne({ uid: uid });
      if (!user) {
        return res.status(404).json({ message: 'Not found' });
      }
      const newUserData = {
        _id: user._id,
        uid: user.uid,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
        subscription: user.subscription,
        createdAt: user.createdAt,
      };
      res.status(200).json(newUserData);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getMe(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      const uid = decodedToken.uid;

      const user = await UserModel.findOne({ uid: uid });
      return res.status(200).json(user);
    } catch (error) {
      return res.status(401).send('Unauthorized');
    }
  }

  async create(req, res) {
    try {
      // check email and uid
      const { email, uid } = req.body;
      const exist = await UserModel.findOne({
        $or: [{ email }, { uid }],
      });
      if (exist) {
        return res.status(400).json({ message: 'Email or uid already exists' });
      }
      const data = new UserModel(req.body);
      const savedData = await data.save();
      res.status(200).json(savedData);
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
      const savedData = await user.save();
      res.status(200).json(savedData.favoriteMovies);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async createWatched(req, res) {
    const { movieId, episodeId, userId, minutes } = req.body;
    try {
      if (!movieId || !userId || !episodeId || !minutes) {
        return res.status(400).json({ message: 'MovieId, episodeId, userId, minutes is required' });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

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

  async createWithGoogle(req, res) {
    try {
      const { email, uid } = req.body;
      const user = await UserModel.findOne({
        $or: [{ email }, { uid }],
      });
      if (user) {
        Object.assign(user, req.body);
        const savedData = await user.save();
        return res.status(200).json(savedData);
      }
      const data = new UserModel(req.body);
      const savedData = await data.save();
      res.status(200).json(savedData);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getTop(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const data = await UserModel.find().sort({ createdAt: -1 }).limit(limit);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
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

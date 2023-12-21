const _ = require('lodash');
const mongoose = require('mongoose');
const MovieModel = require('../models/movie');
const EpisodeModel = require('../models/episode');
const UserModel = require('../models/user');
const ArtistModel = require('../models/artist');
const SubscriptionModel = require('../models/subscription');
const KeywordModel = require('../models/keyword');
const CountryModel = require('../models/country');
const GenreModel = require('../models/genre');
const BaseController = require('./BaseController');
const { handleConvertStringToSlug } = require('../utils/format');

class MovieController extends BaseController {
  constructor() {
    super(MovieModel);
  }

  getPopulateMain() {
    return [
      { path: 'genres', select: 'name slug' },
      { path: 'cast', select: 'name slug' },
      { path: 'directors', select: 'name slug' },
      { path: 'country', select: 'name slug' },
      { path: 'requiredSubscriptions', select: 'name slug' },
    ];
  }

  async getByParam(req, res) {
    try {
      const { season = 1, number = 1, isSeries = false } = req.query;
      const param = req.params.param;

      let movie;
      let episodes = [];
      let currentEpisode;

      const populate = this.getPopulateMain();

      if (mongoose.Types.ObjectId.isValid(param)) {
        if (isSeries === 'true') {
          episodes = await EpisodeModel.find({
            $and: [{ movieId: param }, { season: season ? season : 1 }, { status: true }],
          }).sort({ number: 1 });
          currentEpisode = episodes.find((episode) => episode.number === Number(number));
          movie = await MovieModel.findOne({ _id: param, status: true }).populate(populate);
        } else {
          movie = await MovieModel.findOne({ _id: param, status: true }).populate(populate);
        }
      } else {
        if (isSeries === 'true') {
          movie = await MovieModel.findOne({ slug: param, status: true }).populate(populate);
          episodes = await EpisodeModel.find({
            $and: [{ movieId: movie._id }, { season: season ? season : 1 }, { status: true }],
          }).sort({ number: 1 });
          currentEpisode = episodes.find((episode) => episode.number === Number(number));
        } else {
          movie = await MovieModel.findOne({ slug: param, status: true }).populate(populate);
        }
      }

      if (!movie) {
        return res.status(404).json({ message: 'Not found' });
      }

      const user = await UserModel.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'You must login to watch this movie' });
      }

      const isAllowed = movie.isFree || movie?.requiredSubscriptions.includes(user?.subscription);
      const subscriptionsCanWatch = await SubscriptionModel.find({
        _id: { $in: movie.requiredSubscriptions },
      });

      res.status(200).json({
        movie,
        isAllowed,
        episodes,
        currentEpisode,
        subscriptionsCanWatch,
      });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getUpcoming(req, res) {
    try {
      const populate = this.getPopulateMain();

      const fromDate = new Date();
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      const toDate = new Date(fromDate.getTime() + thirtyDays);

      const data = await MovieModel.find({
        releaseDate: { $gte: fromDate, $lte: toDate },
      })
        .populate(populate)
        .sort({ releaseDate: 1 });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getIsSeries(req, res) {
    try {
      const populate = this.getPopulateMain();
      const data = await MovieModel.find({ isSeries: true , status: true}).populate(populate);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getHomePage(req, res) {
    try {
      const { limit = 10 } = req.query;
      const genres = await GenreModel.find({ isHome: true }).sort({ order: -1 });

      let data = [];
      const populate = this.getPopulateMain();

      for (const genre of genres) {
        const movies = await MovieModel.find({
          genres: { $in: [genre._id] },
        })
          .populate(populate)
          .limit(limit);

        data.push({
          genre,
          movies,
        });
      }

      res.json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getQuery(req, res) {
    try {
      const options = req.paginateOptions;
      options.populate = this.getPopulateMain();
      const data = await MovieModel.paginate({ ...options.query, status: true }, options);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getByKeyword(req, res) {
    const { q, limit = 6, years, genres, countries, artists, isSeries, isFree } = req.query;

    const options = req.paginateOptions;
    options.populate = this.getPopulateMain();
    options.limit = limit;
    options.query = { status: true };

    if (
      !q &&
      !years &&
      !genres &&
      !countries &&
      !artists &&
      !isSeries &&
      !isFree &&
      !options.sort
    ) {
      options.sort = { views: -1 };
      options.limit = 10;
    }

    try {
      let query = {};
      if (q) {
        query = {
          $or: [
            { slug: { $regex: handleConvertStringToSlug(q), $options: 'iu' } },
            { 'title.vi': { $regex: q, $options: 'iu' } },
            { 'title.en': { $regex: q, $options: 'iu' } },
            { tags: { $regex: q, $options: 'iu' } },
          ],
        };

        await KeywordModel.updateMany(
          {
            $or: [
              { keyword: { $regex: q, $options: 'iu' } },
              { slug: { $regex: handleConvertStringToSlug(q), $options: 'iu' } },
            ],
          },
          { $inc: { views: 1000 } },
        );
      }

      if (years) {
        query.releaseDate = { $gte: new Date(`${years}-01-01`), $lte: new Date(`${years}-12-31`) };
      }
      if (genres) {
        const genreIds = await GenreModel.find({ slug: { $in: genres.split(',') } }).select('_id');
        query.genres = { $in: genreIds };
      }
      if (countries) {
        const countryIds = await CountryModel.find({ slug: { $in: countries.split(',') } }).select(
          '_id',
        );
        query.country = { $in: countryIds };
      }
      if (artists) {
        const artistIds = await ArtistModel.find({ slug: { $in: artists.split(',') } }).select(
          '_id',
        );
        query.$or = [
          { cast: { $in: artistIds } },
          { directors: { $elemMatch: { $in: artistIds } } },
        ];
      }
      if (isSeries) query.isSeries = isSeries;
      if (isFree) query.isFree = isFree;

      const data = await MovieModel.paginate(query, options);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRelated(req, res) {
    try {
      const slug = req.params.slug;
      const populate = this.getPopulateMain();

      const movie = await MovieModel.findOne({ slug , status: true}).populate(populate);
      if (!movie) {
        return res.status(404).json({ message: 'Not found' });
      }

      const query = {
        $or: [
          { genres: { $in: movie.genres.map((genre) => genre._id) } },
          { cast: { $in: movie.cast.map((artist) => artist._id) } },
          {
            directors: {
              $elemMatch: { $in: movie.directors.map((artist) => artist._id) },
            },
          },
          { 'country.slug': movie.country.slug },
        ],
        _id: { $ne: movie._id },
        isSeries: movie.isSeries,
      };

      const options = req.paginateOptions;
      options.populate = this.getPopulateMain();
      const data = await MovieModel.paginate(query, options);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRecommend(req, res) {
    try {
      const populate = this.getPopulateMain();
      const user = await UserModel.findById(req.user._id);
      if (!user) return res.status(404).json({ message: 'Not found' });
      
      const favoriteMovies = user.favoriteMovies.map((movie) => movie?.movieId);
      const watchedList = user.watchedList.map((movie) => movie?.movieId);
      const watchLaterList = user.watchLaterList.map((movie) => movie?.movieId);

      const movies = await MovieModel.find({
        _id: { $in: [...favoriteMovies, ...watchedList, ...watchLaterList] },
      }).populate(populate);

      const genres = _.uniqBy(_.flatten(movies.map((movie) => movie.genres)), '_id');
      const cast = _.uniqBy(_.flatten(movies.map((movie) => movie.cast)), '_id');
      const directors = _.uniqBy(_.flatten(movies.map((movie) => movie.directors)), '_id');
      const countries = _.uniqBy(_.flatten(movies.map((movie) => movie.country)), '_id');

      const query = {
        $or: [
          { genres: { $in: genres.map((genre) => genre._id) } },
          { cast: { $in: cast.map((artist) => artist._id) } },
          { directors: { $in : directors.map((artist) => artist._id) } },
          { country: { $in: countries.map((country) => country._id) } },
        ],
        _id: { $nin: [...favoriteMovies, ...watchedList, ...watchLaterList] },
        isSeries: user.isSeries,
      };

      const options = req.paginateOptions;
      options.populate = this.getPopulateMain();
      const data = await MovieModel.paginate(query, options);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getByArtistSlug(req, res) {
    try {
      const slug = req.params.slug;
      const options = req.paginateOptions;
      options.populate = this.getPopulateMain();

      const artist = await ArtistModel.findOne({ slug });
      if (!artist) {
        return res.status(404).json({ message: 'Not found' });
      }

      const query = {
        $or: [{ cast: artist._id }, { directors: artist._id }],
      };

      const data = await MovieModel.paginate(query, options);

      if (!data) {
        return res.status(404).json({ message: 'Not found' });
      }

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getByCountrySlug(req, res) {
    try {
      const slug = req.params.slug;
      const options = req.paginateOptions;
      options.populate = this.getPopulateMain();
      const country = await CountryModel.findOne({ slug });
      if (!country) {
        return res.status(404).json({ message: 'Not found' });
      }
      const data = await MovieModel.paginate({ country: country._id }, options);

      if (!data) {
        return res.status(404).json({ message: 'Not found' });
      }

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getByGenreSlug(req, res) {
    try {
      const slug = req.params.slug;
      const options = req.paginateOptions;
      options.populate = this.getPopulateMain();
      const genre = await GenreModel.findOne({ slug });
      if (!genre) {
        return res.status(404).json({ message: 'Not found' });
      }

      const data = await MovieModel.paginate(
        {
          genres: genre._id,
        },
        options,
      );
      if (!data) {
        return res.status(404).json({ message: 'Not found' });
      }

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async create(req, res) {
    try {
      const tags = req.body.tags;
      const existKeywords = await KeywordModel.find({ keyword: { $in: tags } });
      const keywords = tags.map((tag) => {
        const existKeyword = existKeywords.find((keyword) => keyword.keyword === tag);
        if (existKeyword) return;
        return { keyword: tag, slug: handleConvertStringToSlug(tag) };
      });

      await KeywordModel.insertMany(keywords, { ordered: false });
      const pathsToPopulate = Object.keys(this.model.schema.paths).filter(
        (path) => path !== '_id' && path !== '__v',
      );
      const data = new MovieModel(req.body);
      const savedData = await data.save();
      const savedDataJoin = await MovieModel.findById(savedData._id).populate(pathsToPopulate);
      res.status(200).json(savedDataJoin);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new MovieController();

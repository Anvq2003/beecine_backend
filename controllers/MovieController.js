const _ = require('lodash');
const mongoose = require('mongoose');
const MovieModel = require('../models/movie');
const EpisodeModel = require('../models/episode');
const UserModel = require('../models/user');
const ArtistModel = require('../models/artist');
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
            $and: [{ movieId: param }, { season: season ? season : 1 }],
          }).sort({ number: 1 });
          currentEpisode = episodes.find((episode) => episode.number === Number(number));
          movie = await MovieModel.findById(param).populate(populate);
        } else {
          movie = await MovieModel.findById(param).populate(populate);
        }
      } else {
        if (isSeries === 'true') {
          movie = await MovieModel.findOne({ slug: param }).populate(populate);
          episodes = await EpisodeModel.find({
            $and: [{ movieId: movie._id }, { season: season ? season : 1 }],
          }).sort({ number: 1 });
          currentEpisode = episodes.find((episode) => episode.number === Number(number));
        } else {
          movie = await MovieModel.findOne({ slug: param }).populate(populate);
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

      res.status(200).json({
        movie,
        isAllowed,
        episodes,
        currentEpisode,
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
      const data = await MovieModel.find({ isSeries: true }).populate(populate);
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
      const data = await MovieModel.paginate(options.query || {}, options);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getByKeyword(req, res) {
    const {
      q,
      type = 'less',
      limit = 6,
      years,
      genres,
      countries,
      artists,
      isSeries,
      isFree,
    } = req.query;

    const options = req.paginateOptions;
    options.populate = this.getPopulateMain();

    try {
      let query = {};
      if (q) {
        query = {
          $or: [
            { slug: { $regex: handleConvertStringToSlug(q), $options: 'iu' } },
            { 'title.vi': { $regex: q, $options: 'iu' } },
            { 'title.en': { $regex: q, $options: 'iu' } },
            { 'tags.vi': { $regex: q, $options: 'iu' } },
            { 'tags.en': { $regex: q, $options: 'iu' } },
          ],
        };
      }

      if (years)
        query.releaseDate = { $gte: new Date(`${years}-01-01`), $lte: new Date(`${years}-12-31`) };
      if (genres) query['genres.slug'] = { $in: genres.split(',') };
      if (countries) query['country.slug'] = { $in: countries.split(',') };
      if (artists) {
        query['cast.slug'] = { $in: artists.split(',') };
        query['directors.slug'] = { $in: artists.split(',') };
      }
      if (isSeries) query.isSeries = isSeries;
      if (isFree) query.isFree = isFree;

      if (type === 'less') {
        const movies = await MovieModel.find(query);
        return res.status(200).json({
          data: movies.slice(0, limit),
          info: {
            totalResults: movies.length,
          },
        });
      } else if (type === 'more') {
        const movies = await MovieModel.paginate(query, options);
        return res.status(200).json(movies);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRelated(req, res) {
    try {
      const slug = req.params.slug;
      const populate = this.getPopulateMain();

      const movie = await MovieModel.findOne({ slug }).populate(populate);
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
      };

      const options = req.paginateOptions;
      options.populate = this.getPopulateMain();
      const data = await MovieModel.paginate(query, options);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
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

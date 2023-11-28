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

  async getByParam(req, res) {
    try {
      const { season = 1, number = 1 } = req.query;
      const param = req.params.param;
      let data;
      let episodes = [];
      let currentEpisode;
      const user = await UserModel.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'You must login to watch this movie' });
      }

      await MovieModel.findByIdAndUpdate(param, { $inc: { views: 100 } });

      const populate = [
        { path: 'genres', select: 'name slug' },
        { path: 'cast', select: 'name slug' },
        { path: 'directors', select: 'name slug' },
        { path: 'country', select: 'name slug' },
      ];

      if (mongoose.Types.ObjectId.isValid(param)) {
        data = await MovieModel.findById(param).populate(populate);
        if (data?.isSeries) {
          episodes = await EpisodeModel.find({
            $and: [{ movieId: data._id }, { season: season ? season : 1 }],
          }).sort({ number: 1 });
          currentEpisode = episodes.find((episode) => episode.number === Number(number));
          data.episodes = [...episodes];
          data.currentEpisode = currentEpisode;
        }
      } else {
        data = await MovieModel.findOne({ slug: param }).populate(populate);

        if (data?.isSeries) {
          episodes = await EpisodeModel.find({
            $and: [{ movieId: data._id }, { season: season ? season : 1 }],
          }).sort({ number: 1 });
          currentEpisode = episodes.find((episode) => episode.number === Number(number));
          data.currentEpisode = currentEpisode;
        }
      }

      if (!data) {
        return res.status(404).json({ message: 'Not found' });
      }

      const isAllowed = data.isFree || data.requiredSubscriptions.includes(user?.subscription);

      res.status(200).json({
        data,
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
      const populate = [
        { path: 'genres', select: 'name slug' },
        { path: 'cast', select: 'name slug' },
        { path: 'directors', select: 'name slug' },
        { path: 'country', select: 'name slug' },
      ];

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
      const data = await MovieModel.find({ isSeries: true }).populate([
        { path: 'genres', select: 'name slug' },
        { path: 'cast', select: 'name slug' },
        { path: 'directors', select: 'name slug' },
        { path: 'country', select: 'name slug' },
      ]);
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

      for (const genre of genres) {
        const movies = await MovieModel.find({
          genres: { $in: [genre._id] },
        })
          .populate([
            { path: 'genres', select: 'name slug' },
            { path: 'cast', select: 'name slug' },
            { path: 'directors', select: 'name slug' },
            { path: 'country', select: 'name slug' },
          ])
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
      options.populate = [
        { path: 'genres', select: 'name slug' },
        { path: 'cast', select: 'name slug' },
        { path: 'directors', select: 'name slug' },
        { path: 'country', select: 'name slug' },
      ];
      const data = await MovieModel.paginate({}, options);
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
    options.populate = [
      { path: 'genres', select: 'name slug' },
      { path: 'cast', select: 'name slug' },
      { path: 'directors', select: 'name slug' },
      { path: 'country', select: 'name slug' },
    ];

    try {
      let query = {};
      if (q) {
        query = {
          $or: [
            { 'title.vi': { $regex: q, $options: 'iu' } },
            { 'title.en': { $regex: q, $options: 'iu' } },
            { slug: { $regex: handleConvertStringToSlug(q), $options: 'iu' } },
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
      const movieId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(movieId)) {
        return res.status(400).json({ message: 'Invalid movie id' });
      }
      const movie = await MovieModel.findById(movieId);
      if (!movie) {
        return res.status(404).json({ message: 'Not found' });
      }

      const query = {
        $or: [
          { genres: { $elemMatch: { slug: { $in: movie.genres.map((genre) => genre.slug) } } } },
          { cast: { $elemMatch: { slug: { $in: movie.cast.map((artist) => artist.slug) } } } },
          {
            directors: {
              $elemMatch: { slug: { $in: movie.directors.map((artist) => artist.slug) } },
            },
          },
          { 'country.slug': movie.country.slug },
        ],
        _id: { $ne: movieId },
      };

      const options = req.paginateOptions;
      options.populate = [
        { path: 'genres', select: 'name slug' },
        { path: 'cast', select: 'name slug' },
        { path: 'directors', select: 'name slug' },
        { path: 'country', select: 'name slug' },
      ];
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
      options.populate = [
        { path: 'genres', select: 'name slug' },
        { path: 'cast', select: 'name slug' },
        { path: 'directors', select: 'name slug' },
        { path: 'country', select: 'name slug' },
      ];

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
      options.populate = [
        { path: 'genres', select: 'name slug' },
        { path: 'cast', select: 'name slug' },
        { path: 'directors', select: 'name slug' },
        { path: 'country', select: 'name slug' },
      ];

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
      options.populate = [
        { path: 'genres', select: 'name slug' },
        { path: 'cast', select: 'name slug' },
        { path: 'directors', select: 'name slug' },
        { path: 'country', select: 'name slug' },
      ];
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

const _ = require('lodash');
const mongoose = require('mongoose');
const MovieModel = require('../models/movie');
const GenreModel = require('../models/genre');
const BaseController = require('./BaseController');
const { handleConvertStringToSlug } = require('../utils/format');

class MovieController extends BaseController {
  constructor() {
    super(MovieModel);
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

  async getAdmin(req, res) {
    try {
      const data = await MovieModel.findWithDeleted().populate([
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

  async getByParam(req, res) {
    try {
      const param = req.params.param;
      let data;

      if (mongoose.Types.ObjectId.isValid(param)) {
        data = await MovieModel.findById(param).populate([
          { path: 'genres', select: 'name slug' },
          { path: 'cast', select: 'name slug' },
          { path: 'directors', select: 'name slug' },
          { path: 'country', select: 'name slug' },
        ]);
      } else {
        data = await MovieModel.findOne({ slug: param }).populate([
          { path: 'genres', select: 'name slug' },
          { path: 'cast', select: 'name slug' },
          { path: 'directors', select: 'name slug' },
          { path: 'country', select: 'name slug' },
        ]);
      }

      if (!data) {
        return res.status(404).json({ message: 'Not found' });
      }

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
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

      const query = {
        $or: [
          { cast: { $elemMatch: { slug: slug } } },
          { directors: { $elemMatch: { slug: slug } } },
        ],
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

      const query = { 'country.slug': slug };
      const data = await MovieModel.paginate(query, options);

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

      const query = { genres: { $elemMatch: { slug: slug } } };
      const data = await MovieModel.paginate(query, options);
      if (!data) {
        return res.status(404).json({ message: 'Not found' });
      }

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new MovieController();

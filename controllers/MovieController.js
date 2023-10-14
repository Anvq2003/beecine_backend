const MovieModel = require('../models/movie');
const BaseController = require('./BaseController');
const mongoose = require('mongoose');
const removeAccents = require('remove-accents');

class MovieController extends BaseController {
  constructor() {
    super(MovieModel);
  }

  async getQuery(req, res, next) {
    try {
      const options = req.paginateOptions;
      const data = await MovieModel.paginate({}, options);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getAll(req, res, next) {
    try {
      const data = await MovieModel.findWithDeleted().populate('types');
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getByKeyword(req, res) {
    const { q, type = 'less', limit = 6 } = req.query;
    const options = req.paginateOptions;

    try {
      const query = {
        $or: [
          { title: { $regex: q, $options: 'iu' } },
          { slug: { $regex: removeAccents(q), $options: 'iu' } },
          { tags: { $regex: q, $options: 'iu' } },
          { 'genres.name': { $regex: q, $options: 'iu' } },
          { 'cast.name': { $regex: q, $options: 'iu' } },
          { 'directors.name': { $regex: q, $options: 'iu' } },
          { 'country.name': { $regex: q, $options: 'iu' } },
        ],
      };

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

  async getByParam(req, res, next) {
    try {
      const param = req.params.param;
      let data;

      if (mongoose.Types.ObjectId.isValid(param)) {
        data = await MovieModel.findById(param);
      } else {
        data = await MovieModel.findOne({ slug: param });
      }

      if (!data) {
        return res.status(404).json({ message: 'Not found' });
      }

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getByArtistSlug(req, res, next) {
    try {
      const slug = req.params.slug;
      const options = req.paginateOptions;

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

  async getByCountrySlug(req, res, next) {
    try {
      const slug = req.params.slug;
      const options = req.paginateOptions;

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

  async getByGenreSlug(req, res, next) {
    try {
      const slug = req.params.slug;
      const options = req.paginateOptions;
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

  async create(req, res, next) {
    try {
      const genres = JSON.parse(req.body.genres);
      const cast = JSON.parse(req.body.cast);
      const directors = JSON.parse(req.body.directors);
      const country = JSON.parse(req.body.country);

      const movieData = {
        ...req.body,
        genres,
        cast,
        directors,
        country,
      };

      const data = new MovieModel(movieData);
      const savedCategory = await data.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async update(req, res, next) {
    try {
      const genres = JSON.parse(req.body.genres);
      const cast = JSON.parse(req.body.cast);
      const directors = JSON.parse(req.body.directors);
      const country = JSON.parse(req.body.country);

      const movieData = {
        ...req.body,
        genres,
        cast,
        directors,
        country,
      };

      const data = await MovieModel.findByIdAndUpdate(
        req.params.id,
        { $set: movieData },
        { new: true },
      );
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new MovieController();

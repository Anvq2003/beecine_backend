const ArtistModel = require('../models/artist');
const BaseController = require('./BaseController');
const { handleConvertStringToSlug } = require('../utils/formatString');

class ArtistController extends BaseController {
  constructor() {
    super(ArtistModel);
  }

  async getByKeyword(req, res) {
    const { q, type = 'less', limit = 6 } = req.query;
    const options = req.paginateOptions;

    try {
      const query = {
        $or: [
          { title: { $regex: q, $options: 'iu' } },
          { slug: { $regex: handleConvertStringToSlug(q), $options: 'iu' } },
        ],
      };

      if (type === 'less') {
        const movies = await ArtistModel.find(query);
        return res.status(200).json({
          data: movies.slice(0, limit),
          info: {
            totalResults: movies.length,
          },
        });
      } else if (type === 'more') {
        const movies = await ArtistModel.paginate(query, options);
        return res.status(200).json(movies);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ArtistController();

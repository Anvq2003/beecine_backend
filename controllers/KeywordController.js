const BaseController = require('./BaseController');
const KeywordModel = require('../models/keyword');
const removeAccents = require('remove-accents');
const slugify = require('slugify');
const { handleConvertStringToSlug } = require('../utils/formatString');

class KeywordController extends BaseController {
  constructor() {
    super(KeywordModel);
  }

  async getQuery(req, res) {
    try {
      const keywords = await KeywordModel.find();
      return res.status(200).json(keywords);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByKeyword(req, res) {
    const { q, limit = 6 } = req.query;

    try {
      const query = {
        $or: [
          { keyword: { $regex: q, $options: 'iu' } },
          { slug: { $regex: handleConvertStringToSlug(q), $options: 'iu' } },
        ],
      };

      const keywords = await KeywordModel.find(query);
      return res.status(200).json(keywords.slice(0, limit));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createMany(req, res, next) {
    const { keywords } = req.body;
    keywords.forEach((keyword) => {
      keyword.slug = removeAccents(slugify(keyword.keyword, { lower: true }));
    });
    try {
      const keywordsCreated = await KeywordModel.insertMany(keywords);
      res.status(200).json(keywordsCreated);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new KeywordController();

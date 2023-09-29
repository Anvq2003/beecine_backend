const express = require('express');
const router = express.Router();
const CommonController = require('../controllers/CommonController');

// Routes
router.get('stats', CommonController.stats);
router.get('search', CommonController.search);
router.get('get-top-movie', CommonController.getTopMovie);

module.exports = router;

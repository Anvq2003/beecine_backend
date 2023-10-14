const express = require('express');
const router = express.Router();
const CommonController = require('../controllers/CommonController');
const { paginationMiddleware } = require('../middlewares/paginationMiddleware');

// Routes
router.get('/search', paginationMiddleware, CommonController.search);
router.get('/stats', CommonController.stats);
router.get('/top-movie', CommonController.getTopMovie);
router.get('/update-data', CommonController.update);

module.exports = router;

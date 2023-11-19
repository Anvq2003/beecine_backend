const express = require('express');
const router = express.Router();
const CommonController = require('../controllers/CommonController');
const { paginationMiddleware } = require('../middlewares/paginationMiddleware');
const { sendMailMiddleware } = require('../middlewares/mailMiddleware');

// Routes
router.get('/search', sendMailMiddleware, CommonController.search);
router.get('/stats', CommonController.stats);
router.get('/top-movie', CommonController.getTopMovie);
router.get('/update-data', CommonController.update);

module.exports = router;

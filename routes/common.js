const express = require('express');
const router = express.Router();
const CommonController = require('../controllers/CommonController');
const { paginationMiddleware } = require('../middlewares/paginationMiddleware');
const { sendMailMiddleware } = require('../middlewares/mailMiddleware');

// Routes
router.get('/stats', CommonController.stats);
router.get('/top-movie', CommonController.getTopMovie);
router.get('/top-genre', CommonController.getTopGenre);
router.get('/top-user', CommonController.getTopUser);
router.get('/profit', CommonController.getProfit);



module.exports = router;

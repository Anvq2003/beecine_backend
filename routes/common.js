const express = require('express');
const router = express.Router();
const CommonController = require('../controllers/CommonController');

// Routes
router.get('/stats', CommonController.stats);
router.get('/top-genre', CommonController.getTopGenre);
router.get('/top-user', CommonController.getTopUser);
router.get('/top-movie', CommonController.getTopMovie);
router.get('/profit', CommonController.getProfit);



module.exports = router;

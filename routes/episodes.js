const express = require('express');
const router = express.Router();

const EpisodeController = require('../controllers/EpisodeController');

router.get('/', EpisodeController.getQuery);
router.get('/trash', EpisodeController.getTrash);
router.get('/:id', EpisodeController.getOne);
router.post('/store', EpisodeController.create);
router.put('/update/:id', EpisodeController.update);
router.delete('/delete/:id', EpisodeController.delete);
router.patch('/restore/:id', EpisodeController.restore);
router.delete('/force/:id', EpisodeController.forceDelete);

module.exports = router;

const express = require('express');
const router = express.Router();

const { uploadImage } = require('../middlewares/multer');
const EpisodeController = require('../controllers/EpisodeController');

router.get('/', EpisodeController.getQuery);
router.get('/trash', EpisodeController.getTrash);
router.get('/:id', EpisodeController.getOne);
router.get('/movie/:id', EpisodeController.getByMovie);
router.post('/store', uploadImage.single('image'), EpisodeController.create);
router.post('/store-single', EpisodeController.createSingle);
router.put('/update/:id', uploadImage.single('image'), EpisodeController.update);
router.delete('/delete/:id', EpisodeController.delete);
router.patch('/restore/:id', EpisodeController.restore);
router.delete('/force/:id', EpisodeController.forceDelete);

module.exports = router;

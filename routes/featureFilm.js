const express = require('express');
const router = express.Router();
const FeatureFilmController = require('../controllers/FeatureFilmController');
const bindController = require('../helpers/controllerHelper');
const { validationFeatureFilm } = require('../middlewares/validationMiddleware');
const {
  uploadMulter,
  handleUploadOrUpdateImage,
  handleDeleteImage,
  handleDeleteMultipleImages,
} = require('../middlewares/uploadMiddleware');

const upload = uploadMulter.single('image');

// Routes
router.post(
  '/store',
  upload,
  validationFeatureFilm,
  handleUploadOrUpdateImage,
  bindController(FeatureFilmController, 'create'),
);
router.put(
  '/update/:id',
  upload,
  validationFeatureFilm,
  handleUploadOrUpdateImage,
  bindController(FeatureFilmController, 'update'),
);
router.delete('/delete/:id', handleDeleteImage, bindController(FeatureFilmController, 'delete'));
router.delete(
  '/delete-many',
  handleDeleteMultipleImages,
  bindController(FeatureFilmController, 'deleteMany'),
);

module.exports = router;

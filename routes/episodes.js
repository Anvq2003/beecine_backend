const express = require('express');
const router = express.Router();
const EpisodeController = require('../controllers/EpisodeController');
const bindController = require('../helpers/controllerHelper');
const { validationEpisodeData } = require('../middlewares/validationMiddleware');
const { paginationMiddleware } = require('../middlewares/paginationMiddleware');
const {
  uploadMulter,
  handleUploadOrUpdateImage,
  handleDeleteImage,
  handleDeleteMultipleImages,
} = require('../middlewares/uploadMiddleware');

const upload = uploadMulter.single('image');

// Routes
router.get('/', paginationMiddleware, bindController(EpisodeController, 'getQuery'));
router.get('/admin', bindController(EpisodeController, 'getAdmin'));
router.get('/movie/:id', bindController(EpisodeController, 'getByMovieId'));
router.get('/trash', bindController(EpisodeController, 'getTrash'));
router.get('/:param', bindController(EpisodeController, 'getByParam'));
router.post(
  '/store',
  upload,
  validationEpisodeData,
  handleUploadOrUpdateImage,
  bindController(EpisodeController, 'create'),
);
router.put(
  '/update/:id',
  upload,
  validationEpisodeData,
  handleUploadOrUpdateImage,
  bindController(EpisodeController, 'update'),
);
router.delete('/delete/:id', bindController(EpisodeController, 'delete'));
router.delete('/delete-many', bindController(EpisodeController, 'deleteMany'));
router.patch('/restore/:id', bindController(EpisodeController, 'restore'));
router.delete('/force/:id', handleDeleteImage, bindController(EpisodeController, 'forceDelete'));
router.delete(
  '/force-many',
  handleDeleteMultipleImages,
  bindController(EpisodeController, 'forceDeleteMany'),
);

module.exports = router;

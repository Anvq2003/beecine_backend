const express = require('express');
const router = express.Router();
const EpisodeController = require('../controllers/EpisodeController');
const bindController = require('../helpers/controllerHelper');
const { validationEpisodeData } = require('../middlewares/validationMiddleware');
const { paginationMiddleware } = require('../middlewares/paginationMiddleware');
const { convertData } = require('../middlewares/convertDataMiddleware');
const {
  uploadMulter,
  handleUploadOrUpdateImage,
  handleDeleteImage,
  handleDeleteMultipleImages,
} = require('../middlewares/uploadMiddleware');

const upload = uploadMulter.single('image');

// Routes
router.get('/', paginationMiddleware, bindController(EpisodeController, 'getQuery'));
router.get('/admin', paginationMiddleware, bindController(EpisodeController, 'getAdmin'));
router.get('/movie/:id', bindController(EpisodeController, 'getByMovieId'));
router.get('/trash', bindController(EpisodeController, 'getTrash'));
router.get('/:param', bindController(EpisodeController, 'getByParam'));
router.post(
  '/store',
  upload,
  convertData,
  validationEpisodeData,
  handleUploadOrUpdateImage,
  bindController(EpisodeController, 'create'),
);
router.put(
  '/update/:id',
  upload,
  convertData,
  validationEpisodeData,
  handleUploadOrUpdateImage,
  bindController(EpisodeController, 'update'),
);
router.patch('/change-status/:id', bindController(EpisodeController, 'changeStatus'));
router.delete('/delete/:id', bindController(EpisodeController, 'delete'));
router.delete('/delete-many', bindController(EpisodeController, 'deleteMany'));
router.patch('/restore/:id', bindController(EpisodeController, 'restore'));
router.patch('/restore-many', bindController(EpisodeController, 'restoreMany'));
router.delete('/force/:id', handleDeleteImage, bindController(EpisodeController, 'forceDelete'));
router.delete(
  '/force-many',
  handleDeleteMultipleImages,
  bindController(EpisodeController, 'forceDeleteMany'),
);

module.exports = router;

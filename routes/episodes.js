const express = require('express');
const router = express.Router();
const EpisodeController = require('../controllers/EpisodeController');
const bindController = require('../helpers/controllerHelper');
const { validationEpisodeData } = require('../middlewares/validationMiddleware');
const { paginationMiddleware } = require('../middlewares/paginationMiddleware');
const { convertData } = require('../middlewares/convertDataMiddleware');
const {
  uploadMulter,
  handleUploadMultipleImages,
  handleDeleteMultipleImagesLanguage,
  handleDeleteMultipleImages,
} = require('../middlewares/uploadMiddleware');

const upload = uploadMulter.fields([
  { name: "imageUrl.vi", maxCount: 1 },
  { name: "imageUrl.en", maxCount: 1 },
]);

// Routes
router.get('/', paginationMiddleware, bindController(EpisodeController, 'getQuery'));
router.get('/all', bindController(EpisodeController, 'getAll'));
router.get('/admin', paginationMiddleware, bindController(EpisodeController, 'getAdmin'));
router.get('/movie/:id',paginationMiddleware, bindController(EpisodeController, 'getByMovieId'));
router.get('/trash', bindController(EpisodeController, 'getTrash'));
router.get('/:param', bindController(EpisodeController, 'getByParam'));
router.post(
  '/store',
  upload,
  convertData,
  validationEpisodeData,
  handleUploadMultipleImages,
  bindController(EpisodeController, 'create'),
);
router.put(
  '/update/:id',
  upload,
  convertData,
  validationEpisodeData,
  handleUploadMultipleImages,
  bindController(EpisodeController, 'update'),
);
router.patch('/change-status/:id', bindController(EpisodeController, 'changeStatus'));
router.delete('/delete/:id', bindController(EpisodeController, 'delete'));
router.delete('/delete-many', bindController(EpisodeController, 'deleteMany'));
router.patch('/restore/:id', bindController(EpisodeController, 'restore'));
router.patch('/restore-many', bindController(EpisodeController, 'restoreMany'));
router.delete('/force/:id', handleDeleteMultipleImagesLanguage, bindController(EpisodeController, 'forceDelete'));
router.delete(
  '/force-many',
  handleDeleteMultipleImages,
  bindController(EpisodeController, 'forceDeleteMany'),
);

module.exports = router;

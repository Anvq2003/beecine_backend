const express = require('express');
const router = express.Router();
const ArtistController = require('../controllers/ArtistController');
const bindController = require('../helpers/controllerHelper');
const { validationArtistData } = require('../middlewares/validationMiddleware');
const { paginationMiddleware } = require('../middlewares/paginationMiddleware');
const {
  uploadMulter,
  handleUploadOrUpdateImage,
  handleDeleteImage,
  handleDeleteMultipleImages,
} = require('../middlewares/uploadMiddleware');

const upload = uploadMulter.single('image');

// Routes
router.get('/', paginationMiddleware, bindController(ArtistController, 'getQuery'));
router.get('/all', bindController(ArtistController, 'getAll'));
router.get('/trash', bindController(ArtistController, 'getTrash'));
router.get('/search', paginationMiddleware, bindController(ArtistController, 'getByKeyword'));
router.get('/:param', bindController(ArtistController, 'getByParam'));
router.post(
  '/store',
  upload,
  validationArtistData,
  handleUploadOrUpdateImage,
  bindController(ArtistController, 'create'),
);
router.put(
  '/update/:id',
  upload,
  validationArtistData,
  handleUploadOrUpdateImage,
  bindController(ArtistController, 'update'),
);
router.delete('/delete/:id', bindController(ArtistController, 'delete'));
router.delete('/delete-many', bindController(ArtistController, 'deleteMany'));
router.patch('/restore/:id', bindController(ArtistController, 'restore'));
router.delete('/force/:id', handleDeleteImage, bindController(ArtistController, 'forceDelete'));
router.delete(
  '/force-many',
  handleDeleteMultipleImages,
  bindController(ArtistController, 'forceDeleteMany'),
);

module.exports = router;

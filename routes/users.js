const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const bindController = require('../helpers/controllerHelper');
const { validationUser } = require('../middlewares/validationMiddleware');
const { paginationMiddleware } = require('../middlewares/paginationMiddleware');
const {
  uploadMulter,
  handleUploadOrUpdateImage,
  handleDeleteImage,
  handleDeleteMultipleImages,
} = require('../middlewares/uploadMiddleware');

const upload = uploadMulter.single('image');

// Routes
router.get('/', paginationMiddleware, bindController(UserController, 'getQuery'));
router.get('/admin', bindController(UserController, 'getAdmin'));
router.get('/trash', bindController(UserController, 'getTrash'));
router.get('/check-email/:id', bindController(UserController, 'checkEmail'));
router.get('/:param', bindController(UserController, 'getByParam'));
router.get(
  '/favorite-movies/:id',
  paginationMiddleware,
  bindController(UserController, 'getFavoriteMovies'),
);
router.get(
  '/watched-list/:id',
  paginationMiddleware,
  bindController(UserController, 'getWatchedList'),
);
router.get(
  '/watch-later-list/:id',
  paginationMiddleware,
  bindController(UserController, 'getWatchLaterList'),
);
router.post('/favorite', bindController(UserController, 'createFavorite'));
router.post('/watched', bindController(UserController, 'createWatched'));
router.post('/watch-later', bindController(UserController, 'createWatchLater'));
router.post(
  '/store',
  upload,
  validationUser,
  handleUploadOrUpdateImage,
  bindController(UserController, 'create'),
);
router.put(
  '/update/:id',
  upload,
  validationUser,
  handleUploadOrUpdateImage,
  bindController(UserController, 'update'),
);
router.patch('/change-status/:id', bindController(UserController, 'changeStatus'));
router.delete('/delete/:id', bindController(UserController, 'delete'));
router.delete('/delete-many', bindController(UserController, 'deleteMany'));
router.patch('/restore/:id', bindController(UserController, 'restore'));
router.patch('/restore-many', bindController(UserController, 'restoreMany'));
router.delete('/force/:id', handleDeleteImage, bindController(UserController, 'forceDelete'));
router.delete(
  '/force-many',
  handleDeleteMultipleImages,
  bindController(UserController, 'forceDeleteMany'),
);

module.exports = router;

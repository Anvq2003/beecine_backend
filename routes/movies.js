const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/MovieController');
const bindController = require('../helpers/controllerHelper');
const { validationMovieSchema } = require('../middlewares/validationMiddleware');
const {
  uploadMulter,
  handleUploadOrUpdateImage,
  handleDeleteImage,
  handleDeleteMultipleImages,
} = require('../middlewares/uploadMiddleware');

const upload = uploadMulter.single('image');

router.get('/', bindController(MovieController, 'getQuery'));
router.get('/all', bindController(MovieController, 'getAll'));
router.get('/trash', bindController(MovieController, 'getTrash'));
router.get('/:param', bindController(MovieController, 'getByParam'));
router.post(
  '/store',
  upload,
  validationMovieSchema,
  handleUploadOrUpdateImage,
  bindController(MovieController, 'create'),
);
router.put(
  '/update/:id',
  upload,
  validationMovieSchema,
  handleUploadOrUpdateImage,
  bindController(MovieController, 'update'),
);
router.delete('/delete/:id', bindController(MovieController, 'delete'));
router.delete('/delete-many', bindController(MovieController, 'deleteMany'));
router.patch('/restore/:id', bindController(MovieController, 'restore'));
router.delete('/force/:id', handleDeleteImage, bindController(MovieController, 'forceDelete'));
router.delete(
  '/force-many',
  handleDeleteMultipleImages,
  bindController(MovieController, 'forceDeleteMany'),
);

module.exports = router;

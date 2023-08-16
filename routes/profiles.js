const express = require('express');
const router = express.Router();
const bindController = require('../helpers/controllerHelper');
const ProfileController = require('../controllers/ProfileController');
const { validationProfileSchema } = require('../middlewares/validationMiddleware');
const {
  uploadMulter,
  handleUploadOrUpdateImage,
  handleDeleteImage,
  handleDeleteMultipleImages,
} = require('../middlewares/uploadMiddleware');

const upload = uploadMulter.single('image');

// Routes
router.get('/', bindController(ProfileController, 'getQuery'));
router.get('/all', bindController(ProfileController, 'getAll'));
router.get('/trash', bindController(ProfileController, 'getTrash'));
router.get('/:id', bindController(ProfileController, 'getOne'));
router.post(
  '/store',
  upload,
  validationProfileSchema,
  handleUploadOrUpdateImage,
  bindController(ProfileController, 'create'),
);
router.put(
  '/update/:id',
  upload,
  validationProfileSchema,
  handleUploadOrUpdateImage,
  bindController(ProfileController, 'update'),
);
router.delete('/delete/:id', bindController(ProfileController, 'delete'));
router.delete('/delete-many', bindController(ProfileController, 'deleteMany'));
router.patch('/restore/:id', bindController(ProfileController, 'restore'));
router.delete('/force/:id', handleDeleteImage, bindController(ProfileController, 'forceDelete'));
router.delete(
  '/force-many',
  handleDeleteMultipleImages,
  bindController(ProfileController, 'forceDeleteMany'),
);

module.exports = router;

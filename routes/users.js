const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const bindController = require('../helpers/controllerHelper');
const { validationUserSchema } = require('../middlewares/validationMiddleware');
const {
  uploadMulter,
  handleUploadOrUpdateImage,
  handleDeleteImage,
  handleDeleteMultipleImages,
} = require('../middlewares/uploadMiddleware');

const upload = uploadMulter.single('image');

// Routes
router.get('/', bindController(UserController, 'getQuery'));
router.get('/all', bindController(UserController, 'getAll'));
router.get('/trash', bindController(UserController, 'getTrash'));
router.get('/:param', bindController(UserController, 'getByParam'));
router.get('/check-email/:id', bindController(UserController, 'checkEmail'));
router.post(
  '/store',
  upload,
  validationUserSchema,
  handleUploadOrUpdateImage,
  bindController(UserController, 'create'),
);
router.put(
  '/update/:id',
  upload,
  validationUserSchema,
  handleUploadOrUpdateImage,
  bindController(UserController, 'update'),
);
router.delete('/delete/:id', bindController(UserController, 'delete'));
router.delete('/delete-many', bindController(UserController, 'deleteMany'));
router.patch('/restore/:id', bindController(UserController, 'restore'));
router.delete('/force/:id', handleDeleteImage, bindController(UserController, 'forceDelete'));
router.delete(
  '/force-many',
  handleDeleteMultipleImages,
  bindController(UserController, 'forceDeleteMany'),
);

module.exports = router;
// toi se viet code o day sao

const express = require('express');
const router = express.Router();
const BannerController = require('../controllers/BannerController');
const bindController = require('../helpers/controllerHelper');
const { validationBannerData } = require('../middlewares/validationMiddleware');
const {
  uploadMulter,
  handleUploadOrUpdateImage,
  handleDeleteImage,
  handleDeleteMultipleImages,
} = require('../middlewares/uploadMiddleware');

const upload = uploadMulter.single('image');

router.get('/', bindController(BannerController, 'getQuery'));
router.get('/all', bindController(BannerController, 'getAll'));
router.get('/trash', bindController(BannerController, 'getTrash'));
router.get('/:id', bindController(BannerController, 'getOne'));
router.post(
  '/store',
  upload,
  validationBannerData,
  handleUploadOrUpdateImage,
  bindController(BannerController, 'create'),
);
router.put(
  '/update/:id',
  upload,
  validationBannerData,
  handleUploadOrUpdateImage,
  bindController(BannerController, 'update'),
);
router.delete('/delete/:id', bindController(BannerController, 'delete'));
router.delete('/delete-many', bindController(BannerController, 'deleteMany'));
router.patch('/restore/:id', bindController(BannerController, 'restore'));
router.delete('/force/:id', handleDeleteImage, bindController(BannerController, 'forceDelete'));
router.delete(
  '/force-many',
  handleDeleteMultipleImages,
  bindController(BannerController, 'forceDeleteMany'),
);

module.exports = router;

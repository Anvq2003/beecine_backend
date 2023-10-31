const express = require('express');
const router = express.Router();
const BannerController = require('../controllers/BannerController');
const bindController = require('../helpers/controllerHelper');
const { validationBannerData } = require('../middlewares/validationMiddleware');
const { paginationMiddleware } = require('../middlewares/paginationMiddleware');
const { convertData } = require('../middlewares/convertDataMiddleware');
const {
  uploadMulter,
  handleUploadOrUpdateImage,
  handleDeleteImage,
  handleDeleteMultipleImages,
} = require('../middlewares/uploadMiddleware');

router.get('/', paginationMiddleware, bindController(BannerController, 'getQuery'));
router.get('/admin', paginationMiddleware, bindController(BannerController, 'getAdmin'));
router.get('/trash', bindController(BannerController, 'getTrash'));
router.get('/:param', bindController(BannerController, 'getByParam'));
router.post(
  '/store',
  uploadMulter.single('image'),
  uploadMulter.single('logo'),
  convertData,
  validationBannerData,
  handleUploadOrUpdateImage,
  bindController(BannerController, 'create'),
);
router.put(
  '/update/:id',
  uploadMulter.single('image'),
  uploadMulter.single('logo'),
  convertData,
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

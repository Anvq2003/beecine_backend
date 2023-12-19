const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/MovieController');
const bindController = require('../helpers/controllerHelper');
const { validationMovie } = require('../middlewares/validationMiddleware');
const { paginationMiddleware } = require('../middlewares/paginationMiddleware');
const { convertData } = require('../middlewares/convertDataMiddleware');
const { verifyToken } = require('../middlewares/authMiddleware');

const {
  uploadMulter,
  handleUploadMultipleImages,
  handleDeleteMultipleImagesLanguage,
  handleDeleteMultipleImages,
} = require('../middlewares/uploadMiddleware');

const upload = uploadMulter.fields([
  { name: 'imageUrl.vi', maxCount: 1 },
  { name: 'imageUrl.en', maxCount: 10 },
]);

router.get('/', paginationMiddleware, bindController(MovieController, 'getQuery'));
router.get('/all', bindController(MovieController, 'getAll'));
router.get('/is-series', bindController(MovieController, 'getIsSeries'));
router.get('/upcoming', bindController(MovieController, 'getUpcoming'));
router.get('/admin', paginationMiddleware, bindController(MovieController, 'getAdmin'));
router.get('/homepage', bindController(MovieController, 'getHomePage'));
router.get('/trash', bindController(MovieController, 'getTrash'));
router.get('/search', paginationMiddleware, bindController(MovieController, 'getByKeyword'));
router.get('/recommend', verifyToken, paginationMiddleware, bindController(MovieController, 'getRecommend'));
router.get('/related/:slug', paginationMiddleware, bindController(MovieController, 'getRelated'));
router.get(
  '/artist/:slug',
  paginationMiddleware,
  bindController(MovieController, 'getByArtistSlug'),
);
router.get( 
  '/country/:slug',
  paginationMiddleware,
  bindController(MovieController, 'getByCountrySlug'),
);
router.get('/genre/:slug', paginationMiddleware, bindController(MovieController, 'getByGenreSlug'));
router.get('/:param', verifyToken, bindController(MovieController, 'getByParam'));
router.post(
  '/store',
  upload,
  convertData,
  validationMovie,
  handleUploadMultipleImages,
  bindController(MovieController, 'create'),
);
router.put(
  '/update/:id',
  upload,
  convertData,
  validationMovie,
  handleUploadMultipleImages,
  bindController(MovieController, 'update'),
);
router.patch('/change-status/:id', bindController(MovieController, 'changeStatus'));
router.delete('/delete/:id', bindController(MovieController, 'delete'));
router.delete('/delete-many', bindController(MovieController, 'deleteMany'));
router.patch('/restore/:id', bindController(MovieController, 'restore'));
router.patch('/restore-many', bindController(MovieController, 'restoreMany'));
router.delete(
  '/force/:id',
  handleDeleteMultipleImagesLanguage,
  bindController(MovieController, 'forceDelete'),
);
router.delete(
  '/force-many',
  handleDeleteMultipleImages,
  bindController(MovieController, 'forceDeleteMany'),
);

module.exports = router;

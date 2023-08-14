const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

const bindController = (method) => {
  return UserController[method].bind(UserController);
};
const {
  uploadMulter,
  handleUploadOrUpdateFile,
  handleDeleteFile,
  handleDeleteMultipleFiles,
} = require('../middlewares/uploadMiddleware');

const upload = uploadMulter.single('avatar');

router.get('/', bindController('getQuery'));
router.get('/all', bindController('getAll'));
router.get('/trash', bindController('getTrash'));
router.get('/:id', bindController('getOne'));
router.post('/store', upload, handleUploadOrUpdateFile('avatarUrl'), bindController('create'));
router.put(
  '/update/:id',
  upload,
  handleUploadOrUpdateFile('avatarUrl', 'oldAvatarUrl'),
  bindController('update'),
);
router.delete('/delete/:id', bindController('delete'));
router.delete('/delete-many', bindController('deleteMany'));
router.patch('/restore/:id', bindController('restore'));
router.delete('/force/:id', handleDeleteFile('oldAvatarUrl'), bindController('forceDelete'));
router.delete(
  '/force-many',
  handleDeleteMultipleFiles('oldAvatarUrls'),
  bindController('forceDeleteMany'),
);

module.exports = router;
// toi se viet code o day sao

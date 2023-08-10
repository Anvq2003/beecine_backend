const express = require('express');
const router = express.Router();
const { uploadImage } = require('../middlewares/multer');
const UserController = require('../controllers/UserController');

router.get('/', UserController.getQuery);
router.get('/trash', UserController.getTrash);
router.get('/:id', UserController.getOne);
router.post('/store', uploadImage.single('image'), UserController.create);
router.post('/store-many', UserController.createMany);
router.patch('/restore/:id', UserController.restore);
router.delete('/force/:id', UserController.forceDelete);
// router.put('/update/:id', uploadImage.single('image'), UserController.update);
// router.delete('/delete/:id', UserController.delete);

module.exports = router;
// toi se viet code o day sao

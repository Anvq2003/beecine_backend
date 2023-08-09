const express = require('express');
const router = express.Router();

const { uploadImage } = require('../middlewares/multer');
const BannerController = require('../controllers/BannerController');

router.get('/', BannerController.getQuery);
router.get('/trash', BannerController.getTrash);
router.get('/:id', BannerController.getOne);
router.post('/store', uploadImage.single('image'), BannerController.create);
// router.post('/store-many', BannerController.createMany);
router.put('/update/:id', uploadImage.single('image'), BannerController.update);
router.delete('/delete/:id', BannerController.delete);
router.patch('/restore/:id', BannerController.restore);
router.delete('/force/:id', BannerController.forceDelete);

module.exports = router;

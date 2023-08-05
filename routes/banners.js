const express = require('express');
const router = express.Router();

const upload = require('../middlewares/multer');
const BannerController = require('../controllers/BannerController');

router.get('/', BannerController.getQuery);
router.get('/trash', BannerController.getTrash);
router.get('/:id', BannerController.getOne);
router.post('/store', upload.single('image'), BannerController.create);
// router.post('/store-many', BannerController.createMany);
router.put('/update/:id', upload.single('image'), BannerController.update);
router.delete('/delete/:id', BannerController.delete);
router.patch('/restore/:id', BannerController.restore);
router.delete('/force/:id', BannerController.forceDelete);

module.exports = router;

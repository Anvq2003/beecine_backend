const express = require('express');
const router = express.Router();

const { uploadImage } = require('../middlewares/multer');
const MovieController = require('../controllers/MovieController');

router.get('/', MovieController.getQuery);
router.get('/trash', MovieController.getTrash);
router.get('/:id', MovieController.getOne);
router.post('/store', uploadImage.single('image'), MovieController.create);
router.put('/update/:id', uploadImage.single('image'), MovieController.update);
router.delete('/delete/:id', MovieController.delete);
router.patch('/restore/:id', MovieController.restore);
router.delete('/force/:id', MovieController.forceDelete);

module.exports = router;

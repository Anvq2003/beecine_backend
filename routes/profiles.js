const express = require('express');
const router = express.Router();

const ProfileController = require('../controllers/ProfileController');
const upload = require('../middlewares/multer');

router.get('/', ProfileController.getQuery);
router.get('/trash', ProfileController.getTrash);
router.get('/:id', ProfileController.getOne);
router.post('/store', upload.single('image'), ProfileController.create);
router.post('/store-many', ProfileController.createMany);
router.put('/update/:id', upload.single('image'), ProfileController.update);
router.delete('/delete/:id', ProfileController.delete);
router.patch('/restore/:id', ProfileController.restore);
router.delete('/force/:id', ProfileController.forceDelete);
module.exports = router;

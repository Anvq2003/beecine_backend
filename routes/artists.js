const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');

const ArtistController = require('../controllers/ArtistController');

router.get('/', ArtistController.getQuery);
router.get('/trash', ArtistController.getTrash);
router.get('/:id', ArtistController.getOne);
router.post('/store', upload.single('image'), ArtistController.create);
router.put('/update/:id', upload.single('image'), ArtistController.update);
router.delete('/delete/:id', ArtistController.delete);
router.patch('/restore/:id', ArtistController.restore);
router.delete('/force/:id', ArtistController.forceDelete);

module.exports = router;

const express = require('express');
const router = express.Router();

const ArtistController = require('../controllers/ArtistController');

router.get('/', ArtistController.getQuery);
router.get('/trash', ArtistController.getTrash);
router.get('/:id', ArtistController.getOne);
router.post('/store', ArtistController.create);
router.put('/update/:id', ArtistController.update);
router.delete('/delete/:id', ArtistController.delete);
router.patch('/restore/:id', ArtistController.restore);
router.delete('/force/:id', ArtistController.forceDelete);

module.exports = router;

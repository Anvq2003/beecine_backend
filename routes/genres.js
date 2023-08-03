const express = require('express');
const router = express.Router();

const GenreController = require('../controllers/GenreController');

router.get('/', GenreController.getQuery);
router.get('/trash', GenreController.getTrash);
router.get('/:id', GenreController.getOne);
router.post('/store', GenreController.create);
router.put('/update/:id', GenreController.update);
router.delete('/delete/:id', GenreController.delete);
router.post('/delete-many', GenreController.deleteMany);
router.patch('/restore/:id', GenreController.restore);
router.delete('/force/:id', GenreController.forceDelete);

module.exports = router;

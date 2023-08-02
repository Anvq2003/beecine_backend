const express = require('express');
const router = express.Router();

const GenreController = require('../controllers/GenreController');

router.get('/', GenreController.getQuery);
router.get('/:id', GenreController.getOne);
router.post('/store', GenreController.create);
router.put('/update/:id', GenreController.update);
router.delete('/delete/:id', GenreController.delete);

module.exports = router;

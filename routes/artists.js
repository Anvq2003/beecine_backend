const express = require('express');
const router = express.Router();

const ArtistController = require('../app/controllers/ArtistController');

router.get('/', ArtistController.getQuery);
router.get('/:id', ArtistController.getOne);
router.post('/store', ArtistController.create);
router.put('/update/:id', ArtistController.update);
router.delete('/delete/:id', ArtistController.delete);

module.exports = router;

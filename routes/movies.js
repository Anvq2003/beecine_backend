const express = require('express');
const router = express.Router();

const MovieController = require('../controllers/MovieController');

router.get('/', MovieController.getQuery);
router.get('/:id', MovieController.getOne);
router.post('/store', MovieController.create);
router.put('/update/:id', MovieController.update);
router.delete('/delete/:id', MovieController.delete);

module.exports = router;

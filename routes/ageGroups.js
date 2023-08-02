const express = require('express');
const router = express.Router();

const AgeGroupController = require('../controllers/AgeGroupController');

router.get('/', AgeGroupController.getQuery);
router.get('/:id', AgeGroupController.getOne);
router.post('/store', AgeGroupController.create);
router.post('/store-many', AgeGroupController.createMany);
router.put('/update/:id', AgeGroupController.update);
router.delete('/delete/:id', AgeGroupController.delete);

module.exports = router;

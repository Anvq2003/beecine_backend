const express = require('express');
const router = express.Router();

const CountryController = require('../app/controllers/CountryController');

router.get('/', CountryController.getQuery);
router.get('/:id', CountryController.getOne);
router.post('/store', CountryController.create);
router.post('/store-many', CountryController.createMany);
router.put('/update/:id', CountryController.update);
router.delete('/delete/:id', CountryController.delete);

module.exports = router;

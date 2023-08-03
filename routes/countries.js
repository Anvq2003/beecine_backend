const express = require('express');
const router = express.Router();

const CountryController = require('../controllers/CountryController');

router.get('/', CountryController.getQuery);
router.get('/trash', CountryController.getTrash);
router.get('/:id', CountryController.getOne);
router.post('/store', CountryController.create);
router.post('/store-many', CountryController.createMany);
router.put('/update/:id', CountryController.update);
router.delete('/delete/:id', CountryController.delete);
router.patch('/restore/:id', CountryController.restore);
router.delete('/force/:id', CountryController.forceDelete);

module.exports = router;

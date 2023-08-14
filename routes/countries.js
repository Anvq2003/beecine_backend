const express = require('express');
const router = express.Router();
const CountryController = require('../controllers/CountryController');
const { validateCountryData } = require('../middlewares/validationMiddleware');
const bindController = (method) => {
  return CountryController[method].bind(CountryController);
};

router.get('/', bindController('getQuery'));
router.get('/all', bindController('getAll'));
router.get('/trash', bindController('getTrash'));
router.get('/:id', bindController('getOne'));
router.post('/store', validateCountryData, bindController('create'));
router.put('/update/:id', validateCountryData, bindController('update'));
router.delete('/delete/:id', bindController('delete'));
router.delete('/delete-many', bindController('deleteMany'));
router.patch('/restore/:id', bindController('restore'));
router.delete('/force/:id', bindController('forceDelete'));
router.delete('/force-many', bindController('forceDeleteMany'));

module.exports = router;

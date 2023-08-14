const express = require('express');
const router = express.Router();
const AgeGroupController = require('../controllers/AgeGroupController');
const { validateAgeGroupData } = require('../middlewares/validationMiddleware');

const bindController = (method) => {
  return AgeGroupController[method].bind(AgeGroupController);
};

router.get('/', bindController('getQuery'));
router.get('/all', bindController('getAll'));
router.get('/trash', bindController('getTrash'));
router.get('/:id', bindController('getOne'));
router.post('/store', validateAgeGroupData, bindController('create'));
router.put('/update/:id', validateAgeGroupData, bindController('update'));
router.delete('/delete/:id', bindController('delete'));
router.delete('/delete-many', bindController('deleteMany'));
router.patch('/restore/:id', bindController('restore'));
router.delete('/force/:id', bindController('forceDelete'));
router.delete('/force-many', bindController('forceDeleteMany'));

module.exports = router;

const express = require('express');
const router = express.Router();
const AgeGroupController = require('../controllers/AgeGroupController');
const bindController = require('../helpers/controllerHelper');
const { validateAgeGroupData } = require('../middlewares/validationMiddleware');

// Routes
router.get('/', bindController(AgeGroupController, 'getQuery'));
router.get('/all', bindController(AgeGroupController, 'getAll'));
router.get('/trash', bindController(AgeGroupController, 'getTrash'));
router.get('/:param', bindController(AgeGroupController, 'getByParam'));
router.post('/store', validateAgeGroupData, bindController(AgeGroupController, 'create'));
router.put('/update/:id', validateAgeGroupData, bindController(AgeGroupController, 'update'));
router.delete('/delete/:id', bindController(AgeGroupController, 'delete'));
router.delete('/delete-many', bindController(AgeGroupController, 'deleteMany'));
router.patch('/restore/:id', bindController(AgeGroupController, 'restore'));
router.delete('/force/:id', bindController(AgeGroupController, 'forceDelete'));
router.delete('/force-many', bindController(AgeGroupController, 'forceDeleteMany'));

module.exports = router;

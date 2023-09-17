const express = require('express');
const router = express.Router();
const BillController = require('../controllers/BillController');
const bindController = require('../helpers/controllerHelper');
const { validateBillData } = require('../middlewares/validationMiddleware');

// Routes
router.get('/', bindController(BillController, 'getQuery'));
router.get('/all', bindController(BillController, 'getAll'));
router.get('/top', bindController(BillController, 'getTop'));
router.get('/trash', bindController(BillController, 'getTrash'));
router.get('/:param', bindController(BillController, 'getByParam'));
router.post('/store', validateBillData, bindController(BillController, 'create'));
router.put('/update/:id', validateBillData, bindController(BillController, 'update'));
router.delete('/delete/:id', bindController(BillController, 'delete'));
router.delete('/delete-many', bindController(BillController, 'deleteMany'));
router.patch('/restore/:id', bindController(BillController, 'restore'));
router.delete('/force/:id', bindController(BillController, 'forceDelete'));
router.delete('/force-many', bindController(BillController, 'forceDeleteMany'));

module.exports = router;

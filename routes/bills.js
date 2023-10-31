const express = require('express');
const router = express.Router();
const BillController = require('../controllers/BillController');
const bindController = require('../helpers/controllerHelper');
const { validateBillData } = require('../middlewares/validationMiddleware');
const { paginationMiddleware } = require('../middlewares/paginationMiddleware');

// Routes
router.get('/', paginationMiddleware, bindController(BillController, 'getQuery'));
router.get('/admin', paginationMiddleware, bindController(BillController, 'getAdmin'));
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

const express = require('express');
const router = express.Router();
const SubscriptionController = require('../controllers/SubscriptionController');
const bindController = require('../helpers/controllerHelper');
const { validationSubscription } = require('../middlewares/validationMiddleware');
const { paginationMiddleware } = require('../middlewares/paginationMiddleware');

// Routes
router.get('/', paginationMiddleware, bindController(SubscriptionController, 'getQuery'));
router.get('/admin', paginationMiddleware, bindController(SubscriptionController, 'getAdmin'));
router.get('/trash', bindController(SubscriptionController, 'getTrash'));
router.get('/:param', bindController(SubscriptionController, 'getByParam'));
router.post('/store', validationSubscription, bindController(SubscriptionController, 'create'));
router.put('/update/:id', validationSubscription, bindController(SubscriptionController, 'update'));
router.patch('/change-status/:id', bindController(SubscriptionController, 'changeStatus'));
router.delete('/delete/:id', bindController(SubscriptionController, 'delete'));
router.delete('/delete-many', bindController(SubscriptionController, 'deleteMany'));
router.patch('/restore/:id', bindController(SubscriptionController, 'restore'));
router.patch('/restore-many', bindController(SubscriptionController, 'restoreMany'));
router.delete('/force/:id', bindController(SubscriptionController, 'forceDelete'));
router.delete('/force-many', bindController(SubscriptionController, 'forceDeleteMany'));

module.exports = router;

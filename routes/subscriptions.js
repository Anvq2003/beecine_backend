const express = require('express');
const router = express.Router();
const SubscriptionController = require('../controllers/SubscriptionController');
const bindController = require('../helpers/controllerHelper');
const { validationSubscriptionSchema } = require('../middlewares/validationMiddleware');

// Routes
router.get('/', bindController(SubscriptionController, 'getQuery'));
router.get('/all', bindController(SubscriptionController, 'getAll'));
router.get('/trash', bindController(SubscriptionController, 'getTrash'));
router.get('/:id', bindController(SubscriptionController, 'getOne'));
router.post(
  '/store',
  validationSubscriptionSchema,
  bindController(SubscriptionController, 'create'),
);
router.put(
  '/update/:id',
  validationSubscriptionSchema,
  bindController(SubscriptionController, 'update'),
);
router.delete('/delete/:id', bindController(SubscriptionController, 'delete'));
router.delete('/delete-many', bindController(SubscriptionController, 'deleteMany'));
router.patch('/restore/:id', bindController(SubscriptionController, 'restore'));
router.delete('/force/:id', bindController(SubscriptionController, 'forceDelete'));
router.delete('/force-many', bindController(SubscriptionController, 'forceDeleteMany'));

module.exports = router;

const express = require('express');
const router = express.Router();

const SubscriptionController = require('../controllers/SubscriptionController');

router.get('/', SubscriptionController.getQuery);
router.get('/trash', SubscriptionController.getTrash);
router.get('/:id', SubscriptionController.getOne);
router.post('/store', SubscriptionController.create);
router.post('/store-many', SubscriptionController.createMany);
router.put('/update/:id', SubscriptionController.update);
router.delete('/delete/:id', SubscriptionController.delete);
router.patch('/restore/:id', SubscriptionController.restore);
router.delete('/force/:id', SubscriptionController.forceDelete);

module.exports = router;

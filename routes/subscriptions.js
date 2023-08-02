const express = require('express');
const router = express.Router();

const SubscriptionController = require('../controllers/SubscriptionController');

router.get('/', SubscriptionController.getQuery);
router.get('/:id', SubscriptionController.getOne);
router.post('/store', SubscriptionController.create);
router.post('/store-many', SubscriptionController.createMany);
router.put('/update/:id', SubscriptionController.update);
router.delete('/delete/:id', SubscriptionController.delete);

module.exports = router;

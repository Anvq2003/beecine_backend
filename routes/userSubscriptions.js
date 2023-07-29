const express = require('express');
const router = express.Router();

const UserSubscriptionController = require('../app/controllers/UserSubscriptionController');

router.get('/', UserSubscriptionController.getQuery);
router.get('/:id', UserSubscriptionController.getOne);
router.post('/store', UserSubscriptionController.create);
router.post('/store-many', UserSubscriptionController.createMany);
router.put('/update/:id', UserSubscriptionController.update);
router.delete('/delete/:id', UserSubscriptionController.delete);

module.exports = router;

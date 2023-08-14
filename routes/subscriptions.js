const express = require('express');
const router = express.Router();
const SubscriptionController = require('../controllers/SubscriptionController');

const bindController = (method) => {
  return SubscriptionController[method].bind(SubscriptionController);
};

router.get('/', bindController('getQuery'));
router.get('/all', bindController('getAll'));
router.get('/trash', bindController('getTrash'));
router.get('/:id', bindController('getOne'));
router.post('/store', bindController('create'));
router.put('/update/:id', bindController('update'));
router.delete('/delete/:id', bindController('delete'));
router.delete('/delete-many', bindController('deleteMany'));
router.patch('/restore/:id', bindController('restore'));
router.delete('/force/:id', bindController('forceDelete'));
router.delete('/force-many', bindController('forceDeleteMany'));

module.exports = router;

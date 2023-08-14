const express = require('express');
const router = express.Router();
const BillController = require('../controllers/BillController');
const { validateBillData } = require('../middlewares/validationMiddleware');
const bindController = (method) => {
  return BillController[method].bind(BillController);
};

router.get('/', bindController('getQuery'));
router.get('/all', bindController('getAll'));
router.get('/trash', bindController('getTrash'));
router.get('/:id', bindController('getOne'));
router.post('/store', validateBillData, bindController('create'));
router.put('/update/:id', validateBillData, bindController('update'));
router.delete('/delete/:id', bindController('delete'));
router.delete('/delete-many', bindController('deleteMany'));
router.patch('/restore/:id', bindController('restore'));
router.delete('/force/:id', bindController('forceDelete'));
router.delete('/force-many', bindController('forceDeleteMany'));

module.exports = router;

const express = require('express');
const router = express.Router();

const BillController = require('../controllers/BillController');

router.get('/', BillController.getQuery);
router.get('/trash', BillController.getTrash);
router.get('/:id', BillController.getOne);
router.post('/store', BillController.create);
router.post('/store-many', BillController.createMany);
router.put('/update/:id', BillController.update);
router.delete('/delete/:id', BillController.delete);
router.patch('/restore/:id', BillController.restore);
router.delete('/force/:id', BillController.forceDelete);

module.exports = router;

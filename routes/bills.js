const express = require('express');
const router = express.Router();

const BillController = require('../app/controllers/BillController');

router.get('/', BillController.getQuery);
router.get('/:id', BillController.getOne);
router.post('/store', BillController.create);
router.post('/store-many', BillController.createMany);
router.put('/update/:id', BillController.update);
router.delete('/delete/:id', BillController.delete);

module.exports = router;

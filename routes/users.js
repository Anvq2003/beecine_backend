const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');

router.get('/', UserController.getQuery);
router.get('/:id', UserController.getOne);
router.post('/store', UserController.create);
router.post('/store-many', UserController.createMany);
// router.put('/update/:id', UserController.update);
// router.delete('/delete/:id', UserController.delete);

module.exports = router;

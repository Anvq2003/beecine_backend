const express = require('express');
const router = express.Router();

const ProfileController = require('../controllers/ProfileController');

router.get('/', ProfileController.getQuery);
router.get('/trash', ProfileController.getTrash);
router.get('/:id', ProfileController.getOne);
router.post('/store', ProfileController.create);
router.post('/store-many', ProfileController.createMany);
router.put('/update/:id', ProfileController.update);
router.delete('/delete/:id', ProfileController.delete);
router.patch('/restore/:id', ProfileController.restore);
router.delete('/force/:id', ProfileController.forceDelete);
module.exports = router;

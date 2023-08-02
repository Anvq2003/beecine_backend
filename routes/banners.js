const express = require('express');
const router = express.Router();

const BannerController = require('../controllers/BannerController');

router.get('/', BannerController.getQuery);
router.get('/:id', BannerController.getOne);
router.post('/store', BannerController.create);
router.post('/store-many', BannerController.createMany);
router.put('/update/:id', BannerController.update);
router.delete('/delete/:id', BannerController.delete);

module.exports = router;

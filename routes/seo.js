const express = require('express');
const router = express.Router();
const SeoController = require('../controllers/SeoController');
const bindController = require('../helpers/controllerHelper');
const { validationSeo } = require('../middlewares/validationMiddleware');

// Routes
router.get('/all', bindController(SeoController, 'getAll'));
router.post('/store', validationSeo, bindController(SeoController, 'create'));
router.put('/update/:id', bindController(SeoController, 'update'));

module.exports = router;

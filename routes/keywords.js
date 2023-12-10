const express = require('express');
const router = express.Router();
const KeywordController = require('../controllers/KeywordController');
const bindController = require('../helpers/controllerHelper');
const { paginationMiddleware } = require('../middlewares/paginationMiddleware');

// Routes
router.get('/', paginationMiddleware, bindController(KeywordController, 'getQuery'));
router.get('/admin', paginationMiddleware, bindController(KeywordController, 'getAdmin'));
router.get('/search', bindController(KeywordController, 'getByKeyword'));
router.post('/store', bindController(KeywordController, 'create'));
router.post('/store-many', bindController(KeywordController, 'createMany'));
router.put('/update/:id', bindController(KeywordController, 'update'));
router.delete('/delete/:id', bindController(KeywordController, 'forceDelete'));

module.exports = router;

const express = require('express');
const router = express.Router();
const RefreshTokenController = require('../controllers/RefreshTokenController');
const bindController = require('../helpers/controllerHelper');

router.get('/', bindController(RefreshTokenController, 'getQuery'));
router.post('/store', bindController(RefreshTokenController, 'create'));
router.delete('/delete/:id', bindController(RefreshTokenController, 'delete'));

module.exports = router;

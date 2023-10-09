const express = require('express');
const router = express.Router();
const GenreController = require('../controllers/GenreController');
const bindController = require('../helpers/controllerHelper');
const { validateGenreData } = require('../middlewares/validationMiddleware');
const { paginationMiddleware } = require('../middlewares/paginationMiddleware');

// Routes
router.get('/', paginationMiddleware, bindController(GenreController, 'getQuery'));
router.get('/all', bindController(GenreController, 'getAll'));
router.get('/trash', bindController(GenreController, 'getTrash'));
router.get('/:param', bindController(GenreController, 'getByParam'));
router.post('/store', validateGenreData, bindController(GenreController, 'create'));
router.put('/update/:id', validateGenreData, bindController(GenreController, 'update'));
router.delete('/delete/:id', bindController(GenreController, 'delete'));
router.delete('/delete-many', bindController(GenreController, 'deleteMany'));
router.patch('/restore/:id', bindController(GenreController, 'restore'));
router.delete('/force/:id', bindController(GenreController, 'forceDelete'));
router.delete('/force-many', bindController(GenreController, 'forceDeleteMany'));

module.exports = router;

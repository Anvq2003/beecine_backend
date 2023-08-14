const express = require('express');
const router = express.Router();
const GenreController = require('../controllers/GenreController');
const { validateGenreData } = require('../middlewares/validationMiddleware');

const bindController = (method) => {
  return GenreController[method].bind(GenreController);
};

router.get('/', bindController('getQuery'));
router.get('/all', bindController('getAll'));
router.get('/trash', bindController('getTrash'));
router.get('/:id', bindController('getOne'));
router.post('/store', validateGenreData, bindController('create'));
router.put('/update/:id', validateGenreData, bindController('update'));
router.delete('/delete/:id', bindController('delete'));
router.delete('/delete-many', bindController('deleteMany'));
router.patch('/restore/:id', bindController('restore'));
router.delete('/force/:id', bindController('forceDelete'));
router.delete('/force-many', bindController('forceDeleteMany'));

module.exports = router;

const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/CommentController');
const bindController = require('../helpers/controllerHelper');
const { validateCommentData } = require('../middlewares/validationMiddleware');

// Routes
router.get('/', bindController(CommentController, 'getQuery'));
router.get('/all', bindController(CommentController, 'getAll'));
router.get('/trash', bindController(CommentController, 'getTrash'));
router.get('/:id', bindController(CommentController, 'getOne'));
router.post('/store', validateCommentData, bindController(CommentController, 'create'));
router.put('/update/:id', validateCommentData, bindController(CommentController, 'update'));
router.delete('/delete/:id', bindController(CommentController, 'delete'));
router.delete('/delete-many', bindController(CommentController, 'deleteMany'));
router.patch('/restore/:id', bindController(CommentController, 'restore'));
router.delete('/force/:id', bindController(CommentController, 'forceDelete'));
router.delete('/force-many', bindController(CommentController, 'forceDeleteMany'));

module.exports = router;

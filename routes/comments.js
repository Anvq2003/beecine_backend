const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/CommentController');
const bindController = require('../helpers/controllerHelper');
const { validateCommentData, validateReplyData } = require('../middlewares/validationMiddleware');

// Routes
router.get('/', bindController(CommentController, 'getQuery'));
router.get('/all', bindController(CommentController, 'getAll'));
router.get('/trash', bindController(CommentController, 'getTrash'));
router.get('/:param', bindController(CommentController, 'getByParam'));
router.get('/like-comment', bindController(CommentController, 'likeComment'));
router.get('/like-reply', bindController(CommentController, 'likeReply'));
router.post('/store', validateCommentData, bindController(CommentController, 'create'));
router.post('/store-reply', validateReplyData, bindController(CommentController, 'createReply'));
router.put('/update/:id', validateCommentData, bindController(CommentController, 'update'));
router.put('/update-reply', validateReplyData, bindController(CommentController, 'updateReply'));
router.delete('/delete/:id', bindController(CommentController, 'delete'));
router.delete('/delete-many', bindController(CommentController, 'deleteMany'));
router.patch('/restore/:id', bindController(CommentController, 'restore'));
router.delete('/force/:id', bindController(CommentController, 'forceDelete'));
router.delete('/force-many', bindController(CommentController, 'forceDeleteMany'));

module.exports = router;

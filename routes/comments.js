const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/CommentController');
const bindController = require('../helpers/controllerHelper');
const { validateCommentData, validateReplyData } = require('../middlewares/validationMiddleware');
const { paginationMiddleware } = require('../middlewares/paginationMiddleware');

// Routes
router.get('/', paginationMiddleware, bindController(CommentController, 'getQuery'));
router.get('/admin/:id', paginationMiddleware, bindController(CommentController, 'getAdmin'));
router.get(
  '/group-by-movie',
  paginationMiddleware,
  bindController(CommentController, 'getGroupByMovie'),
);
router.get('/movie/:id', paginationMiddleware, bindController(CommentController, 'getByMovieId'));
router.get('/admin', paginationMiddleware, bindController(CommentController, 'getAdmin'));
router.get('/trash', bindController(CommentController, 'getTrash'));
router.get('/:param', bindController(CommentController, 'getByParam'));
router.post('/like-comment', bindController(CommentController, 'likeComment'));
router.post('/like-reply', bindController(CommentController, 'likeReply'));
router.post('/store', validateCommentData, bindController(CommentController, 'create'));
router.post('/store-reply', validateReplyData, bindController(CommentController, 'createReply'));
router.patch('/update/:id', bindController(CommentController, 'update'));
router.patch('/update-reply', bindController(CommentController, 'updateReply'));
router.patch('/change-status/:id', bindController(CommentController, 'changeStatus'));
router.patch('/change-status-reply/:commentId/:replyId', bindController(CommentController, 'changeStatusReply'));
router.delete('/delete/:id', bindController(CommentController, 'delete'));
router.delete('/delete-reply', bindController(CommentController, 'deleteReply'));
router.delete('/delete-many', bindController(CommentController, 'deleteMany'));
router.patch('/restore/:id', bindController(CommentController, 'restore'));
router.patch('/restore-many', bindController(CommentController, 'restoreMany'));
router.delete('/force/:id', bindController(CommentController, 'forceDelete'));
router.delete('/force-many', bindController(CommentController, 'forceDeleteMany'));
module.exports = router;

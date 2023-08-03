const express = require('express');
const router = express.Router();

const CommentController = require('../controllers/CommentController');

router.get('/', CommentController.getQuery);
router.get('/trash', CommentController.getTrash);
router.get('/:id', CommentController.getOne);
router.post('/like-dislike', CommentController.toggleLike);
// router.post('/replies/like-dislike', CommentController.toggleReplyLike);
router.post('/reply', CommentController.reply);
router.post('/store', CommentController.create);
router.put('/update/:id', CommentController.update);
router.delete('/delete/:id', CommentController.delete);
router.patch('/restore/:id', CommentController.restore);
router.delete('/force/:id', CommentController.forceDelete);

module.exports = router;

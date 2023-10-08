const CommentModel = require('../models/comment');
const BaseController = require('./BaseController');
class CommentController extends BaseController {
  constructor() {
    super(CommentModel);
  }

  async createReply(req, res) {
    try {
      const { commentId } = req.body;
      const comment = await CommentModel.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
      comment.replies.push(req.body);
      const savedData = await comment.save();
      res.status(200).json(savedData);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async updateReply(req, res) {
    try {
      const { commentId, replyId } = req.body;
      const comment = await CommentModel.findByIdAndUpdate(
        commentId,
        { $pull: { replies: { _id: replyId } } },
        { new: true },
      );
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      comment.replies.push(req.body);
      const savedData = await comment.save();
      res.status(200).json(savedData);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async likeComment(req, res) {
    try {
      const { commentId, userId, action } = req.query;
      res.json({ commentId, userId, action });
      // const comment = await CommentModel.findById(commentId);

      // if (!comment) {
      //   return res.status(404).json({ message: 'Comment not found' });
      // }

      // const { likes, dislikes } = comment;

      // if (action === 'like') {
      //   if (likes.includes(userId)) {
      //     comment.likes.pull(userId);
      //   } else {
      //     comment.likes.push(userId);
      //     comment.dislikes.pull(userId);
      //   }
      // } else if (action === 'dislike') {
      //   if (dislikes.includes(userId)) {
      //     comment.dislikes.pull(userId);
      //   } else {
      //     comment.dislikes.push(userId);
      //     comment.likes.pull(userId);
      //   }
      // }

      // await comment.save();

      // res.json(comment);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async likeReply(req, res) {
    try {
      const { commentId, replyId, userId, action } = req.query;

      const comment = await CommentModel.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      const replies = comment.replies;

      const index = replies.findIndex((r) => r._id.equals(replyId));
      if (index === -1) {
        return res.status(404).json({ message: 'Reply not found' });
      }

      let reply = replies[index];

      if (action === 'like') {
        if (reply.likes.includes(userId)) {
          reply.likes.pull(userId);
        } else {
          reply.likes.push(userId);
          reply.dislikes.pull(userId);
        }
      } else if (action === 'dislike') {
        if (reply.dislikes.includes(userId)) {
          reply.dislikes.pull(userId);
        } else {
          reply.dislikes.push(userId);
          reply.likes.pull(userId);
        }
      }

      comment.replies = [...replies.slice(0, index), reply, ...replies.slice(index + 1)];
      await comment.save();
      res.json(comment);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new CommentController();

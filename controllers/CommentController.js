const CommentModel = require('../models/comment');
const BaseController = require('./BaseController');
const _ = require('lodash');

class CommentController extends BaseController {
  constructor() {
    super(CommentModel);
  }

  async getQuery(req, res) {
    try {
      const options = req.paginateOptions;
      const data = await CommentModel.paginate({ status: true }, options);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getGroupByMovie(req, res) {
    try {
      const comments = await CommentModel.find().populate({
        path: 'movieId',
        select: 'title',
      });
      const movies = _.groupBy(comments, 'movieId.title');
      res.status(200).json(movies);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getByMovieId(req, res) {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Movie id is required' });

    try {
      const options = req.paginateOptions;
      options.populate = {
        path: 'userId',
        select: 'name imageUrl',
      };

      const data = await CommentModel.paginate({ movieId: id }, options);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
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
      const comment = await CommentModel.findById(commentId);

      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      const { likes, dislikes } = comment;

      if (action === 'LIKE') {
        if (likes.includes(userId)) {
          comment.likes.pull(userId);
        } else {
          comment.likes.push(userId);
          comment.dislikes.pull(userId);
        }
      } else if (action === 'DISLIKE') {
        if (dislikes.includes(userId)) {
          comment.dislikes.pull(userId);
        } else {
          comment.dislikes.push(userId);
          comment.likes.pull(userId);
        }
      }

      await comment.save();

      res.json(comment);
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

  async deleteReply(req, res) {
    try {
      const { commentId, replyId } = req.query;

      const result = await CommentModel.updateOne(
        { _id: commentId },
        {
          $pull: {
            replies: {
              _id: replyId,
            },
          },
        },
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new CommentController();

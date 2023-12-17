const CommentModel = require('../models/comment');
const UserModel = require('../models/user');
const BaseController = require('./BaseController');
const paginationHelper = require('../helpers/Pagination');
const _ = require('lodash');

class CommentController extends BaseController {
  constructor() {
    super(CommentModel);
  }

  async getAdmin(req, res) {
    try {
      const { id } = req.params;
      const { counts } = req.query;
      const options = req.paginateOptions;
      options.query = { ...options.query, movieId: id };
      options.sort = { createdAt: -1 };
      options.populate = [{ path: 'userId' }, { path: 'movieId' }, { path: 'replies.userId' }];

      const countFields = counts ? counts.split(',') : [];
      const allData = await this.model.findWithDeleted();

      const getKeyAndCount = countFields.map((value) => {
        const [field, fieldValue] = value.split(':');
        const count = allData.filter((item) => {
          if (fieldValue) {
            return String(item[field]) === String(fieldValue) && !item.deleted && item.movieId.equals(id);
          }
          return !item.deleted;
        }).length;
        return { [value]: count };
      });

      const count = {
        all: _.filter(allData, (item) => !item.deleted && item.movieId.equals(id)).length,
        active: _.filter(allData, (item) => item.status && !item.deleted && item.movieId.equals(id)).length,
        inactive: _.filter(allData, (item) => !item.status && !item.deleted && item.movieId.equals(id)).length,
        deleted: _.filter(allData, (item) => item.deleted && item.movieId.equals(id)).length,
        ...Object.assign({}, ...getKeyAndCount),
      };

      if (options.query && options.query.deleted) {
        let data = await this.model.findWithDeleted({ deleted: true , movieId: id}).populate(options.populate);
        const newData = paginationHelper({
          page: options.page,
          limit: options.limit,
          data,
        });

        return res.status(200).json({ ...newData, count, options });
      }

      const data = await this.model.paginate(options.query || {}, options);
      const info = { ...data, count };
      res.status(200).json(info);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getGroupByMovie(req, res) {
    const options = req.paginateOptions;
    try {
      const comments = await CommentModel.aggregate([
        {
          $group: {
            _id: '$movieId',
            createdAt: { $first: '$createdAt' },
            totalComments: { $sum: 1 },
            totalLikes: { $sum: { $size: '$likes' } },
            totalDislikes: { $sum: { $size: '$dislikes' } },
            totalReplies: { $sum: { $size: '$replies' } },
          },
        },
        {
          $lookup: {
            from: 'movies',
            localField: '_id',
            foreignField: '_id',
            as: 'movie',
          },
        },
        {
          $unwind: '$movie',
        },
        {
          $project: {
            _id: 1,
            movie: {
              _id: 1,
              title: 1,
              imageUrl: 1,
              isSeries: 1,
              isFree: 1,
            },
            createdAt: 1,
            totalComments: '$totalComments',
            totalLikes: '$totalLikes',
            totalDislikes: '$totalDislikes',
            totalReplies: '$totalReplies',
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ]);

      const newData = paginationHelper({
        page: options.page,
        limit: options.limit,
        data: comments,
      });

      res.status(200).json(newData);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getByMovieId(req, res) {
    const { id } = req.params;
    const { replyId, limitReply = 10 } = req.query;

    if (!id) return res.status(400).json({ message: 'Movie id is required' });

    try {
      const options = req.paginateOptions;
      options.populate = [
        { path: 'userId', select: 'name imageUrl role' },
        { path: 'replies.userId', select: 'name imageUrl role' },
      ];

      if (!options.sort)
        options.sort = {
          createdAt: -1,
        };

      const data = await CommentModel.paginate({ movieId: id }, options);

      // Sort replies
      data.data.forEach((comment) => {
        comment.replies.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
      });

      // Limit replies
      if (replyId) {
        const comment = data.data.find((c) => c._id.equals(replyId));
        if (comment) {
          comment.replies = comment.replies.slice(0, limitReply);
        }
      }

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async update(req, res) {
    try {
      const pathsToPopulate = Object.keys(this.model.schema.paths).filter(
        (path) => path !== '_id' && path !== '__v',
      );
      req.body.isEdited = true;
      const data = await this.model
        .findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        .populate(pathsToPopulate);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async createReply(req, res) {
    try {
      const { commentId, content, userId, movieId } = req.body;
      if (!content || !userId || !movieId) {
        return res.status(400).json({ message: 'Content, userId and movieId are required' });
      }
      const comment = await CommentModel.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
      comment.replies.push(req.body);
      const savedData = await comment.save();

      const reply = savedData.replies[savedData.replies.length - 1];
      const user = await UserModel.findById(reply.userId, 'name imageUrl');
      reply.userId = user;
      res.status(200).json(reply);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async updateReply(req, res) {
    try {
      const { commentId, replyId, content } = req.body;

      const comment = await CommentModel.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      const replyIndex = comment.replies.findIndex((r) => r._id == replyId);
      if (replyIndex === -1) {
        return res.status(404).json({ message: 'Reply not found' });
      }

      comment.replies[replyIndex].content = content;
      comment.replies[replyIndex].isEdited = true;

      await comment.save();

      res.json(comment.replies[replyIndex]);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async likeComment(req, res) {
    try {
      const { commentId, userId, action } = req.body;
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
      const { commentId, replyId, userId, action } = req.body;

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

      if (action === 'LIKE') {
        if (reply.likes.includes(userId)) {
          reply.likes.pull(userId);
        } else {
          reply.likes.push(userId);
          reply.dislikes.pull(userId);
        }
      } else if (action === 'DISLIKE') {
        if (reply.dislikes.includes(userId)) {
          reply.dislikes.pull(userId);
        } else {
          reply.dislikes.push(userId);
          reply.likes.pull(userId);
        }
      }

      comment.replies = [...replies.slice(0, index), reply, ...replies.slice(index + 1)];
      await comment.save();
      res.json(comment.replies[index]);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async changeStatusReply(req, res) {
    const { commentId, replyId } = req.params;
    try {
      const comment = await CommentModel.findById(commentId);
      if (!comment) return res.status(404).json({ message: 'Comment not found' });
      const index = comment.replies.findIndex((r) => r._id.equals(replyId));
      if (index === -1) {
        return res.status(404).json({ message: 'Reply not found' });
      }
      comment.replies[index].status = !comment.replies[index].status;
      await comment.save();
      res.status(200).json(comment.replies[index]);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async deleteReply(req, res) {
    try {
      const { commentId, replyId } = req.query;

      const result = await CommentModel.findById(commentId, 'replies');
      if (!result) return res.status(404).json({ message: 'Comment not found' });

      const index = result.replies.findIndex((r) => r._id.equals(replyId));
      if (index === -1) {
        return res.status(404).json({ message: 'Reply not found' });
      }
      result.replies[index].status = false;
      await result.save();
      res.status(200).json({ message: 'Delete successfully', commentId, replyId });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new CommentController();

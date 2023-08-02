const mongoose = require('mongoose');
const { Reply, Comment } = require('../models/comment');

class CommentController {
  // [GET] api/comments
  async getQuery(req, res) {
    try {
      const query = Object.assign({}, req.query);
      const data = await Comment.find(query);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [POST] api/comments/reply
  async reply(req, res) {
    try {
      const { commentId, profileId, comment } = req.body;
      const reply = new Reply({ profileId, comment });
      await Comment.findByIdAndUpdate(commentId, { $push: { replies: reply } });
      res.status(200).json('Reply successfully');
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [POST] api/comments/like
  async toggleLike(req, res) {
    const { commentId, profileId, action } = req.body;

    try {
      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      if (action === 'like') {
        const likedIndex = comment.likes.indexOf(profileId);

        if (likedIndex === -1) {
          comment.likes.push(profileId);
          if (comment.dislikes.indexOf(profileId) !== -1) {
            comment.dislikes.splice(comment.dislikes.indexOf(profileId), 1);
          }
        } else {
          comment.likes.splice(likedIndex, 1);
        }
      } else if (action === 'dislike') {
        const dislikedIndex = comment.dislikes.indexOf(profileId);

        if (dislikedIndex === -1) {
          comment.dislikes.push(profileId);
          if (comment.likes.indexOf(profileId) !== -1) {
            comment.likes.splice(comment.likes.indexOf(profileId), 1);
          }
        } else {
          comment.dislikes.splice(dislikedIndex, 1);
        }
      }

      await comment.save();
      res.status(200).json(comment);
      // res.status(200).json({ message: 'Success' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // [POST] api/comments/replies/like-dislike
  async toggleReplyLike(req, res) {
    const { replyId, profileId, action } = req.body;
    // try {
    const reply = await Reply.findById(replyId);

    // if (!reply) {
    //   return res.status(404).json({ message: 'Reply not found' });
    // }

    res.status(200).json({ reply });

    // if (action === 'like') {
    //   const likedIndex = reply.likes.indexOf(profileId);
    //   if (likedIndex === -1) {
    //     reply.likes.push(profileId);
    //     if (reply.dislikes.indexOf(profileId) !== -1) {
    //       reply.dislikes.splice(reply.dislikes.indexOf(profileId), 1);
    //     }
    //   } else {
    //     reply.likes.splice(likedIndex, 1);
    //   }
    // } else if (action === 'dislike') {
    //   const dislikedIndex = reply.dislikes.indexOf(profileId);
    //   if (dislikedIndex === -1) {
    //     reply.dislikes.push(profileId);
    //     if (reply.likes.indexOf(profileId) !== -1) {
    //       reply.likes.splice(reply.likes.indexOf(profileId), 1);
    //     }
    //   } else {
    //     reply.dislikes.splice(dislikedIndex, 1);
    //   }
    // }
    // } catch (error) {
    //   res.status(500).json(error);
    // }
  }

  // [GET] api/comments/:id
  async getOne(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }
      const data = await Comment.findById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [POST] api/comments/store
  async create(req, res) {
    try {
      const data = new Comment(req.body);
      const savedCategory = await data.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [POST] api/comments/store-many
  async createMany(req, res) {
    try {
      const data = await Comment.insertMany(req.body);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [PUT] api/comments/update/:id
  async update(req, res) {
    try {
      const data = await Comment.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // [DELETE] api/comments/delete/:id
  async delete(req, res) {
    try {
      await Comment.findByIdAndDelete(req.params.id);
      res.status(200).json('Deleted successfully');
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = new CommentController();

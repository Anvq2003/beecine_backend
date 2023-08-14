const CommentModel = require('../models/comment');
const BaseController = require('./BaseController');
class CommentController extends BaseController {
  constructor() {
    super(CommentModel);
  }
}

module.exports = new CommentController();

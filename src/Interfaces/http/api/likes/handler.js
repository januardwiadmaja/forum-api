import LikeOrDislikeCommentUseCase from '../../../../Applications/use_case/LikeOrDislikeCommentUseCase.js';

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(req, res, next) {
    try {
      const { id: userId } = req.user;

      const likeOrDislikeCommentUseCase = this._container.getInstance(
        LikeOrDislikeCommentUseCase.name,
      );
      const likeOrDislike = await likeOrDislikeCommentUseCase.execute(
        userId,
        req.params,
      );

      res.status(200).json({
        status: 'success',
        data: {
          likeOrDislike,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default LikesHandler;

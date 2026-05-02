/* eslint-disable indent */
import CommentDetail from '../../Domains/comments/entities/CommentDetail.js';
import ReplyDetail from '../../Domains/replies/entities/ReplyDetail.js';
import ThreadDetail from '../../Domains/threads/entities/ThreadDetail.js';

class GetThreadDetailUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    commentLikeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(threadId) {
    const [
      threadDetail,
      threadComments,
      threadCommentsReplies,
      threadCommentsLikes,
    ] = await Promise.all([
      this._threadRepository.getThreadById(threadId),
      this._commentRepository.getCommentsByThreadId(threadId),
      this._replyRepository.getRepliesByThreadId(threadId),
      this._commentLikeRepository.getLikesByThreadId(threadId),
    ]);

    threadDetail.comments = threadComments.map(
      (comment) =>
        new CommentDetail({
          ...comment,
          replies: comment.is_delete
            ? []
            : threadCommentsReplies
                // eslint-disable-next-line indent
                .filter((reply) => reply.comment === comment.id)
                .map((reply) => new ReplyDetail(reply)),
          likeCount: threadCommentsLikes.filter(
            (like) => like.comment === comment.id,
          ).length,
        }),
    );

    return new ThreadDetail(threadDetail);
  }
}

export default GetThreadDetailUseCase;

import { vi } from 'vitest';
import LikeOrDislikeCommentUseCase from '../LikeOrDislikeCommentUseCase.js';
import CommentLikeRepository from '../../../Domains/likes/CommentLikeRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import Like from '../../../Domains/likes/entities/Like.js';

describe('LikeOrDislikeCommentUseCase', () => {
  it('should orchestrating the like comment action correctly if comment is not liked', async () => {
    // Arrange
    const like = new Like({
      commentId: 'comment-123',
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    /** mocking needed function */
    mockThreadRepository.checkThreadAvailability = vi.fn(() =>
      Promise.resolve(),
    );
    mockCommentRepository.checkCommentAvailability = vi.fn(() =>
      Promise.resolve(),
    );
    mockCommentLikeRepository.verifyUserCommentLike = vi.fn(() =>
      Promise.resolve(false),
    );
    mockCommentLikeRepository.addLike = vi.fn(() => Promise.resolve());

    /** creating use case instance */
    const likeOrDislikeCommentUseCase = new LikeOrDislikeCommentUseCase({
      commentLikeRepository: mockCommentLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await likeOrDislikeCommentUseCase.execute('user-123', {
      threadId: 'thread-123',
      commentId: 'comment-123',
    });

    // Assert
    expect(mockThreadRepository.checkThreadAvailability).toBeCalledWith(
      'thread-123',
    );
    expect(mockCommentRepository.checkCommentAvailability).toBeCalledWith(
      'comment-123',
      'thread-123',
    );
    expect(mockCommentLikeRepository.verifyUserCommentLike).toBeCalledWith(
      like,
    );
    expect(mockCommentLikeRepository.addLike).toBeCalledWith(like);
  });

  it('should orchestrating the dislike comment action correctly if comment is liked', async () => {
    // Arrange
    const like = new Like({
      commentId: 'comment-123',
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    /** mocking needed function */
    mockThreadRepository.checkThreadAvailability = vi.fn(() =>
      Promise.resolve(),
    );
    mockCommentRepository.checkCommentAvailability = vi.fn(() =>
      Promise.resolve(),
    );
    mockCommentLikeRepository.verifyUserCommentLike = vi.fn(() =>
      Promise.resolve(true),
    );
    mockCommentLikeRepository.deleteLike = vi.fn(() => Promise.resolve());

    /** creating use case instance */
    const likeOrDislikeCommentUseCase = new LikeOrDislikeCommentUseCase({
      commentLikeRepository: mockCommentLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await likeOrDislikeCommentUseCase.execute('user-123', {
      threadId: 'thread-123',
      commentId: 'comment-123',
    });

    // Assert
    expect(mockThreadRepository.checkThreadAvailability).toBeCalledWith(
      'thread-123',
    );
    expect(mockCommentRepository.checkCommentAvailability).toBeCalledWith(
      'comment-123',
      'thread-123',
    );
    expect(mockCommentLikeRepository.verifyUserCommentLike).toBeCalledWith(
      like,
    );
    expect(mockCommentLikeRepository.deleteLike).toBeCalledWith(like);
  });
});

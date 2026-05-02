import express from 'express';

const createLikesRouter = (handler, authMiddleware) => {
  const router = express.Router();

  router.put(
    '/:threadId/comments/:commentId/likes',
    authMiddleware,
    handler.putLikeHandler,
  );

  return router;
};

export default createLikesRouter;

import LikesHandler from './handler.js';
import createLikesRouter from './routes.js';

export default (container, authMiddleware) => {
  const likesHandler = new LikesHandler(container);
  return createLikesRouter(likesHandler, authMiddleware);
};

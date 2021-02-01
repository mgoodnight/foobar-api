import { Router } from 'express';
import { userRouter } from './user';
import { sessionRouter } from './sessions';

const apiRouter = Router();

apiRouter.use('/session', sessionRouter);
apiRouter.use('/user', userRouter);

export { apiRouter };

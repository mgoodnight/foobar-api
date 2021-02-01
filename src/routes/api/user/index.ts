import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { evalSchemaCheck } from '../../middleware/eval-schema-check';

import { createSession } from '../../middleware/create-session';
import { getUserId } from '../../middleware/get-user-id';
import { sanitizeBody } from '../../middleware/sanitize-body';
import { userPostSchema } from './schemas/user-post';
import { userPutSchema } from './schemas/user-put';
import { createUser } from '../../controllers/create-user';
import { updateUser } from '../../controllers/update-user';
import { getUserInfo } from '../../controllers/get-user-info';
import { destroySession } from '../../middleware/destroy-session';

const userRouter = Router();

userRouter.get('/', getUserId, getUserInfo);
userRouter.post('/', checkSchema(userPostSchema), evalSchemaCheck, sanitizeBody, createUser, createSession);
userRouter.put('/', checkSchema(userPutSchema), evalSchemaCheck, sanitizeBody, updateUser, destroySession);

export { userRouter };

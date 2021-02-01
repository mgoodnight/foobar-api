import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { evalSchemaCheck } from '../middleware/eval-schema-check';

import { sanitizeBody } from '../middleware/sanitize-body';
import { sesssionPostSchema } from './schemas/session-post';
import { createSession } from '../middleware/create-session';
import { destroySession } from '../middleware/destroy-session';
import { checkSessionAttempt } from '../controllers/check-session-attempt';

const sessionRouter = Router();

sessionRouter.post('/', checkSchema(sesssionPostSchema), evalSchemaCheck, sanitizeBody, checkSessionAttempt, createSession);
sessionRouter.delete('/', destroySession);

export { sessionRouter };

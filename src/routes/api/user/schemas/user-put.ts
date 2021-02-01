import { Schema } from 'express-validator';
import { userPostSchema } from './user-post';
import { userId } from './share';

export const userPutSchema: Schema = {
  userAccountId: {
    in: ['params'],
    ...userId
  },
  ...userPostSchema
};

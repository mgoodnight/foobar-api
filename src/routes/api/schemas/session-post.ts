import { Schema } from 'express-validator';

export const sesssionPostSchema: Schema = {
  'session.email': {
    in: ['body'],
    isEmail: {
      errorMessage: { error: 'Invalid email' }
    },
    exists: {
      errorMessage: { error: 'Missing email' }
    }
  },
  'session.password': {
    in: ['body'],
    exists: {
      errorMessage: { error: 'Missing password' }
    }
  }
};

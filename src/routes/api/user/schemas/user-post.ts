import { Schema } from 'express-validator';

export const userPostSchema: Schema = {
  'user.email': {
    in: ['body'],
    isEmail: {
      errorMessage: { error: 'Invalid email' }
    },
    exists: {
      errorMessage: { error: 'Missing email' }
    }
  },
  'user.password': {
    in: ['body'],
    isLength: {
      options: { min: 8 },
      errorMessage: { error: 'Password must be at least 8 characters in length' },
    },
    exists: {
      errorMessage: { error: 'Missing password' },
    }
  },
  'user.fullName': {
    in: ['body'],
    isLength: {
      options: { max: 100 },
      errorMessage: { error: 'Full name must be less than 100 characters' },
    }
  }
};

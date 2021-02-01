import { NextFunction, Request, Response } from 'express';
import * as config from 'config';
import { ConfigSessionLocals, UserToApi } from '../../interfaces';
import { UserDao } from '../../daos/user';

/**
 * Express controller for POST /user
 *
 * POST /user {UserToApi}
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  // We expect middleware to provide (see sanitize-body)
  const newUser = res.locals.user as UserToApi;

  if (!newUser) {
    return res.status(400).send({ error: 'Missing user' });
  }

  try {
    const foundAccount = (await UserDao.getUsers({ email: newUser.email }))[0];

    if (foundAccount) {
      return res.status(400).send({ error: 'A user already exists with this email' });
    }

    const userDao = await UserDao.createUser(newUser);

    if (userDao && userDao.id) {
      const localsConfig = config.get<ConfigSessionLocals>('session.locals');
      res.locals[localsConfig.userId] = userDao.id;

      return next();
    }

    res.status(500).send();
    console.error('Unknown issue creating user');
  } catch (userError) {
    console.error(userError);
    res.status(500).send();
  }
};

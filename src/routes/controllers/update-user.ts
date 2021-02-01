import { NextFunction, Request, Response } from 'express';
import * as config from 'config';
import { ConfigSessionLocals, UserUpdateToApi } from '../../interfaces';
import { UserDao } from '../../daos/user';

/**
 * Express controller for PUT /user
 *
 * PUT /user {UserToApi}
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const localsConfig = config.get<ConfigSessionLocals>('session.locals');
  const userId = +res.locals[localsConfig.userId];

  if (!userId) {
    return res.status(401).send();
  }

  // We expect middleware to provide (see sanitize-body)
  const newUpdatedUser = res.locals.user as UserUpdateToApi;

  if (!newUpdatedUser) {
    return res.status(400).send({ error: 'Missing user' });
  }

  try {
    const userDao = (await UserDao.getUsers({ id: +userId }))[0];

    if (userDao) {
      const updateResult = await userDao.update(newUpdatedUser);

      if (!updateResult) {
        return res.status(500).send();
      }

      return res.status(204).send();
    }

    // If we have a session, but the userId within the session cannot be found
    // Push to destroy-session middleware to invalidate cookie
    next();
  } catch (userError) {
    console.error(userError);
    res.status(500).send();
  }
};

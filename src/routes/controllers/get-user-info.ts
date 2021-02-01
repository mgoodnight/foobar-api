import { Request, Response } from 'express';
import * as config from 'config';
import { UserDao } from '../../daos/user';
import { ConfigSessionLocals } from '../../interfaces';

/**
 * Express controller for GET /user
 *
 * @param {Request} req
 * @param {Response} res
 */
export const getUserInfo = async (req: Request, res: Response) => {
  const sessionLocalsConfig = config.get<ConfigSessionLocals>('session.locals');
  const userId = +res.locals[sessionLocalsConfig.userId];

  if (!userId) {
    return res.status(401).send();
  }

  try {
    const userDao = (await UserDao.getUsers({ id: userId }))[0];

    if (!userDao) {
      return res.status(404).send();
    }

    const userInfo = userDao.buildApi();

    res.send({ user: userInfo });
  } catch (userError) {
    console.error(userError);
    return res.status(500).send();
  }
};

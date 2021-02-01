import { NextFunction, Request, Response } from 'express';
import * as config from 'config';
import { UserDao } from '../../daos/user';
import { ConfigSessionLocals, SessionToApi } from '../../interfaces';

/**
 * Express controller for POST /session
 * Expects to be pushed to session creation middlware if all is well
 *
 * POST /session {SessionToApi}
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const checkSessionAttempt = async (req: Request, res: Response, next: NextFunction) => {
  const sessionPayload = res.locals.session as SessionToApi;

  try {
    const foundAccount = (await UserDao.getUsers({ email: sessionPayload.email }))[0];

    if (!foundAccount || !(await foundAccount.doesPasswordMatch(sessionPayload.password))) {
      return res.status(401).send();
    }

    const localsConfig = config.get<ConfigSessionLocals>('session.locals');
    res.locals[localsConfig.userId] = foundAccount.id;

    // Expects to move onto create-session middleware
    next();
  } catch (sessionErr) {
    console.error(sessionErr);
    res.status(500).send();
  }
};

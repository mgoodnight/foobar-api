import { Request, Response } from 'express';
import * as config from 'config';
import { SessionHelper } from '../../helpers/session';
import { ConfigSession, UserSession } from '../../interfaces';

/**
 * Express middleware for creating sessions
 * Expects res.locals to contain a userId
 *
 * @param {Request} req
 * @param {Response} res
 */
export const createSession = async (req: Request, res: Response) => {
  const sessionConfig = config.get<ConfigSession>('session');
  const localsConfig = sessionConfig.locals;

  const userId = res.locals[localsConfig.userId];

  if (!userId) {
    return res.status(401).send();
  }

  const cookieConfig = sessionConfig.cookie;
  const { secret, ...createOpts } = sessionConfig.token;

  const userSession = new SessionHelper(secret);
  const sessionToken = await userSession.create({ userId: userId } as UserSession, createOpts);

  res.cookie(cookieConfig.name, sessionToken);
  res.status(201).send();
};

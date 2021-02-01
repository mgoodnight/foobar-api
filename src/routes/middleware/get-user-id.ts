import { Request, Response, NextFunction } from 'express';
import * as config from 'config';
import { SessionHelper } from '../../helpers/session';
import { ConfigSession, UserSession } from '../../interfaces';

/**
 * Express middleware for extracting userId from session token (if it exists)
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const getUserId = async (req: Request, res: Response, next: NextFunction) => {
  const cookies = req.cookies;
  const sessionConfig = config.get<ConfigSession>('session');
  const sessionCookieConfig = sessionConfig.cookie;

  if (cookies && cookies[sessionCookieConfig.name]) {
    const { secret } = sessionConfig.token;
    const userSession = new SessionHelper(secret);

    try {
      const sessionPayload = await userSession.verify<UserSession>(cookies[sessionCookieConfig.name]);

      if (sessionPayload.userId) {
        const sessionLocalsConfig = sessionConfig.locals;
        res.locals[sessionLocalsConfig.userId] = sessionPayload.userId;
      }
    } catch (sessionErr) { } // This is just a passive check
  }

  next();
};

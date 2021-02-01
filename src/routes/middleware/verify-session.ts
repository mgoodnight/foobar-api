import { Request, Response, NextFunction } from 'express';
import * as config from 'config';
import { ConfigSession } from '../../interfaces/config';

/**
 * Express middleware for verifying if userId was extracted from session
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const verifySession = async (req: Request, res: Response, next: NextFunction) => {
  const sessionConfig = config.get<ConfigSession>('session');
  const localsConfig = sessionConfig.locals;

  if (!res.locals[localsConfig.userId]) {
    const cookieConfig = sessionConfig.cookie;
    res.cookie(cookieConfig.name, null);

    return res.status(401).send();
  }

  next();
};

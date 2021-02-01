import { Request, Response } from 'express';
import * as config from 'config';
import { ConfigSessionCookie } from '../../interfaces/config';

/**
 * Express middleware for destroying sessions
 *
 * @param {Request} req
 * @param {Response} res
 */
export const destroySession = async (req: Request, res: Response) => {
  const sessionCookieConfig = config.get<ConfigSessionCookie>('session.cookie');
  res.cookie(sessionCookieConfig.name, null);

  return res.status(204).send();
};

import { NextFunction, Request, Response } from 'express';
import { matchedData } from 'express-validator';

/**
 * Express middleware for passing only the expected body payload to controllers
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const sanitizeBody = (req: Request, res: Response, next: NextFunction) => {
  const requestBody = matchedData(req, { locations: ['body'], includeOptionals: true });

  if (requestBody.hasOwnProperty('session')) {
    res.locals.session = requestBody.session;
  } else if (requestBody.hasOwnProperty('user')) {
    res.locals.user = requestBody.user;
  }

  next();
};

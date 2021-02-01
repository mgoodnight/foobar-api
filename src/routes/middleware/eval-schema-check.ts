import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

/**
 * Express middleware for validating express-validator request schema
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const evalSchemaCheck = (req: Request, res: Response, next: NextFunction) => {
  const validationErrors = validationResult(req).array({ onlyFirstError: true });

  if (validationErrors.length) {
    return res.status(400).send(validationErrors[0].msg);
  }

  next();
};

import type { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendError } from '../utils/response';
import type { AuthRequest } from './authenticate';

const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      sendError(res, StatusCodes.FORBIDDEN, 'You do not have permission');
      return;
    }
    next();
  };
};

export default authorize;
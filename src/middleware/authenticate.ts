import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { sendError } from '../utils/response';
import config from '../config/index';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    name: string;
    role: string;
  };
}

const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      sendError(res, StatusCodes.UNAUTHORIZED, 'No token provided');
      return;
    }

    const decoded = jwt.verify(token, config.secret) as {
      id: number;
      name: string;
      role: string;
    };

    req.user = decoded;
    next();
  } catch (err) {
    sendError(res, StatusCodes.UNAUTHORIZED, 'Invalid or expired token');
  }
};

export default authenticate;
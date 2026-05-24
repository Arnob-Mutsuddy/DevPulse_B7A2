import type { Response} from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendError } from '../utils/response';

const errorHandler = (
  err: Error,res: Response) => {
  console.error(err.stack);

  sendError(
    res,
    StatusCodes.INTERNAL_SERVER_ERROR,
    'Something wrong',
    err.message
  );
};

export default errorHandler;
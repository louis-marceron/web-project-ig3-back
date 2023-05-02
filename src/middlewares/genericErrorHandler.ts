import { Request, Response, NextFunction } from 'express';
import { ErrorWithStatus } from './errorWithStatus';

function genericErrorHandler(err: ErrorWithStatus, req: Request, res: Response, next: NextFunction): void {
    res.status(err.status);

    res.json({
        message: err.message,
    });
}

export default genericErrorHandler;

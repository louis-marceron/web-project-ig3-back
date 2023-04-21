import { Request, Response, NextFunction } from 'express'
import { ErrorWithStatus } from './errorWithStatus'

function notFoundErrorHandler(req: Request, res: Response, next: NextFunction): void {
    const err: ErrorWithStatus = new ErrorWithStatus("Not Found", 404)
    next(err)
}

export default notFoundErrorHandler;

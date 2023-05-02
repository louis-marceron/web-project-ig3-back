import { Request, Response, NextFunction } from 'express'

function notFoundErrorHandler(req: Request, res: Response, next: NextFunction): void {
    res.status(404).json({ error: "Not found" })
}

export default notFoundErrorHandler;

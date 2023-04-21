import { Request, Response, NextFunction } from 'express';
import { ErrorWithStatus } from './errorWithStatus';

function genericErrorHandler(err: ErrorWithStatus, req: Request, res: Response, next: NextFunction): void {
    const status = err.status;
    res.status(status);

    // Envoie le message de l'erreur comme réponse
    res.json({
        message: err.message,
        // Empêche la fuite d'informations sensibles en production
        error: process.env.NODE_ENV === 'development' ? err : {},
    });
}

export default genericErrorHandler;

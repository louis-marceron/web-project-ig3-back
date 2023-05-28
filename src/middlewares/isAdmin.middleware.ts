import { Request, Response, NextFunction } from 'express'


async function isAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        console.error(`A user object should be attached to the request object in the authenticateToken middleware. 
        authenticateToken middleware should be called before isAdmin middleware.`)
        return res.status(500).json({ error: 'Internal server error.' })
    }

    if (!req.user.is_admin)
        return res.status(403).json({ error: 'You are not authorized to perform this action.' })

    next()
}

export default isAdmin;

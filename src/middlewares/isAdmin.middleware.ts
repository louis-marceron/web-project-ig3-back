import { Request, Response, NextFunction } from 'express'

async function isAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        console.error('authenticateToken() middleware should be called before this middleware.')
        return res.status(500).json({ error: 'Internal server error.' })
    }

    const isAdmin = req.user.is_admin

    if (!isAdmin)
        return res.status(403).json({ error: 'You are not authorized to perform this action.' })

    next()
}

export default isAdmin

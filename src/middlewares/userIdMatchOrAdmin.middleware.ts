import { Request, Response, NextFunction } from 'express'

async function userIdMatchUrlOrAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        console.error('authenticateToken() middleware should be called before this middleware.')
        return res.status(500).json({ error: 'Internal server error.' })
    }

    const idFromUrl: string = req.params.id
    const idFromUser: string = req.user.user_id.toString()
    const isAdmin: boolean = req.user.is_admin

    if (!isAdmin && idFromUser !== idFromUrl)
        return res.status(403).json({ error: 'You are not authorized to perform this action.' })

    next()
}

export default userIdMatchUrlOrAdmin

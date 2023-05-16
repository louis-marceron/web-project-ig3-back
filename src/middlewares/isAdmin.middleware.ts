import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload, JsonWebTokenError, TokenExpiredError, NotBeforeError } from 'jsonwebtoken'
import AppUser from '../models/AppUser.model'

async function isAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        if (process.env.SECRET == undefined)
            throw Error('You must define the environment variable "SECRET".')

        if (!req.cookies)
            return res.status(401).json({ error: 'No cookie found.' })

        if (!req.cookies.token)
            return res.status(401).json({ error: 'JWT not found in the cookie.' })

        const payload = jwt.verify(req.cookies.token, process.env.SECRET)

        if ((payload as JwtPayload).id == undefined)
            return res.status(400).json({ error: 'User id missing in the JWT.' })

        const user_id: string = (payload as JwtPayload).id

        const user = await AppUser.findByPk(user_id)

        if (user == null)
            return res.status(404).json({ error: 'There is no account associated with this ID.' })

        if (user.is_admin)
            return next()

        return res.status(403).json({ error: 'You are not authorized to perform this action.' })
    }

    catch (error) {
        if (error instanceof TokenExpiredError)
            return res.status(401).json({ error: 'JWT has expired.' })

        if (error instanceof JsonWebTokenError)
            return res.status(401).json({ error: 'JWT is not recognize by the server.' })

        if (error instanceof NotBeforeError)
            return res.status(401).json({ error: 'JWT is not active.' })

        console.error('Error verifying the JWT:', error)
        return res.status(500).json({ error: 'Internal server error.' })
    }
}

export default isAdmin

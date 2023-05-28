import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload, JsonWebTokenError, TokenExpiredError, NotBeforeError } from 'jsonwebtoken'
import AppUser from '../models/AppUser.model'
import MissingEnvVariableError from '../types/missingEnvVariableError'

async function authenticateToken(req: Request, res: Response, next: NextFunction) {
    try {
        if (!process.env.SECRET)
            throw new MissingEnvVariableError('SECRET')

        const token = req.cookies?.token

        if (!token)
            throw new AuthenticationError('JWT not found in the cookie.')

        const payload = jwt.verify(token, process.env.SECRET) as JwtPayload

        if (!payload.id)
            throw new AuthenticationError('User id missing in the JWT.')

        const user_id: string = payload.id

        const userFromDB = await AppUser.findByPk(user_id)

        if (!userFromDB)
            throw new AuthenticationError('There is no account associated with this ID.')

        req.user = userFromDB
        return next()
    }

    catch (error) {
        if (error instanceof AuthenticationError ||
            error instanceof TokenExpiredError ||
            error instanceof JsonWebTokenError ||
            error instanceof NotBeforeError) {
            return res.status(401).json({ error: error.message })
        }

        console.error('Error verifying the JWT:', error)
        return res.status(500).json({ error: 'Internal server error.' })
    }
}

class AuthenticationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "AuthenticationError"
    }
}

export default authenticateToken

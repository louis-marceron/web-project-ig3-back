import { NextFunction, Request, Response } from "express"
import { z, ZodError } from 'zod'
import bcrypt from 'bcrypt'
import { UniqueConstraintError } from 'sequelize'
import AppUser from '../models/AppUser.model'
import AppUserSchema from '../validators/AppUser.validator'
import jwt from 'jsonwebtoken'

const TOKEN_LIFE_SPAN: string = '15d'
const COOKIE_LIFE_SPAN: number = 1000 * 60 * 60 * 24 * 15 // 15 days in milliseconds

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await AppUser.findAll()

    if (users.length === 0) {
      // According to the MDN, we should use the 404 response code when : 
      // "The server cannot find the requested resource. [...] In an API, this can also
      // mean that the endpoint is valid but the resource itself does not exist."
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      return res.status(404).json({ error: 'No users found' })
    }

    const strippedUsers = users.map(user => omitPassword(user))
    return res.status(200).json(strippedUsers)
  }

  catch (error) {
    console.error('Error fetching users:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await AppUser.findByPk(req.params.id)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    return res.status(200).json({
      user_id: user.user_id,
      email: user.email,
      is_admin: user.is_admin,
    })
  }

  catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const createUser = async (req: Request, res: Response) => {
  try {
    const userInput = AppUserSchema.parse(req.body)
    const newUser = await AppUser.create(userInput)
    const newUserWithoutPassword = omitPassword(newUser)
    return res.status(201).json(newUserWithoutPassword)
  }

  catch (error) {
    if (error instanceof z.ZodError)
      return res.status(400).json({ error: "Validation error", details: error.errors })

    if (error instanceof UniqueConstraintError)
      return res.status(400).json({ error: "An account with this email already exists" })

    console.error("Error creating user:", error)
    return res.status(500).json({ error: "Error creating user" })
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const partialUserSchema = AppUserSchema.partial()
    const user = await AppUser.findByPk(req.params.id)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const userInput = partialUserSchema.parse(req.body)
    await user.update(userInput)
    return res.status(204).json('User updated')
  }

  catch (error) {
    if (error instanceof ZodError)
      return res.status(400).json({ error: 'Validation error', details: error.errors })

    if (error instanceof UniqueConstraintError)
      return res.status(400).json({ error: "An account with this email already exists" })

    console.error('Error updating user:', error)
    return res.status(500).json({ error: 'Error updating user' })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await AppUser.findByPk(req.params.id)
    if (!user) { return res.status(404).json('User not found') }
    await user.destroy()
    return res
      .status(204)
      .cookie('loggedIn', 'false', { secure: true, httpOnly: false })
      .json('User deleted')
  }

  catch (error) {
    console.error('Error deleting user', error)
    return res.status(500).json('Error deleting user')
  }
}

export const signup = async (req: Request, res: Response) => {
  try {
    if (!process.env.SECRET)
      throw Error('You must define the environment variable "SECRET".')

    const userInput = AppUserSchema.parse(req.body)
    const newUser = await AppUser.create(userInput)
    const token: string = jwt.sign({ id: newUser.user_id }, process.env.SECRET, { expiresIn: TOKEN_LIFE_SPAN })
    return res
      .cookie('token', token, { secure: true, httpOnly: true, maxAge: COOKIE_LIFE_SPAN, sameSite: 'lax' })
      .status(201)
      .json({
        message: 'Registered successfully',
        userId: newUser.user_id
      });
  }

  catch (error) {
    if (error instanceof z.ZodError)
      return res.status(400).json({ error: "Validation error", details: error.errors })

    if (error instanceof UniqueConstraintError)
      return res.status(400).json({ error: "An account with this email already exists" })

    console.error("Error creating user:", error)
    return res.status(500).json({ error: "Error creating user" })
  }
}

export const login = async (req: Request, res: Response) => {
  console.log('login')
  try {
    if (!process.env.SECRET)
      throw Error('You must define the environment variable "SECRET".')

    const INVALID_CREDENTIAL_MESSAGE = 'Invalid credentials'
    const credentials = AppUserSchema.parse(req.body)

    // Check if the user exists
    const user = await AppUser.findOne({ where: { email: credentials.email } })
    if (user === null)
      return res.status(401).json({ error: INVALID_CREDENTIAL_MESSAGE })

    // Check if the password is valid
    const isValidPassword: boolean = await bcrypt.compare(credentials.password, user.password)
    if (!isValidPassword)
      return res.status(401).json({ error: INVALID_CREDENTIAL_MESSAGE })

    // Return a JWT as a cookie
    const token: string = jwt.sign({ id: user.user_id }, process.env.SECRET, { expiresIn: TOKEN_LIFE_SPAN })
    return res
      .status(200)
      .cookie('token', token, { secure: true, httpOnly: true, maxAge: COOKIE_LIFE_SPAN, sameSite: 'lax' })
      .json({
        message: 'Logged in successfully',
        userId: user.user_id
      });
  }

  catch (error) {
    if (error instanceof z.ZodError)
      return res.status(400).json({ error: 'Validation error', details: error.errors })

    console.error('Error creating user:', error)
    return res.status(500).json({ error: 'Error creating user' })
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    if (!process.env.SECRET)
      throw Error('You must define the environment variable "SECRET".')

    // Return an expired JWT as a cookie since the client can't access the cookie to delete it (httpOnly)
    const token: string = jwt.sign({ id: "logout user" }, process.env.SECRET, { expiresIn: 0 })

    return res
      .status(200)
      .cookie('token', token, { secure: true, httpOnly: true, path: '/', sameSite: 'none' })
      .json('Log out successfully')
  }

  catch (error) {
    console.error('Error logging out:', error)
    return res.status(500).json({ error: 'Error logging out.' })
  }
}

function omitPassword(user: AppUser) {
  const { password, ...rest } = user.dataValues
  return rest
}

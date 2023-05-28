import AppUser from '../models/AppUser.model'

declare global {
  namespace Express {
    interface Request {
      user: AppUser
    }
  }
}

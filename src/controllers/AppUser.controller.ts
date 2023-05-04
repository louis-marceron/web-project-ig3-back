import { NextFunction, Request, Response, Router } from "express"
import z, { ZodError } from 'zod'
import AppUser from "../models/AppUser.model";
import { AppUserSchema } from "../validators/AppUser.validator"
import { UniqueConstraintError } from "sequelize";

const userController = Router();

// GET all users
userController.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await AppUser.findAll();

    if (users.length === 0) {
      // According to the MDN, we should use the 404 response code when : 
      // "The server cannot find the requested resource. [...] In an API, this can also
      // mean that the endpoint is valid but the resource itself does not exist."
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      return res.status(404).json({ error: 'No users found' })
    }

    const strippedUsers = users.map(user => stripUserValues(user))
    res.status(200).json(strippedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET one user
userController.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await AppUser.findByPk(req.params.id)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.status(200).json({
      user_id: user.user_id,
      email: user.email,
      is_admin: user.is_admin,
    })
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new user
userController.post("/", async (req: Request, res: Response) => {
  try {
    const userInput = AppUserSchema.parse(req.body);
    const newUser = await AppUser.create(userInput);
    res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation error", details: error.errors });
    } else {
      res.status(500).json({ error: "Error creating user" });
      console.error("Error creating user:", error);
    }
  }
})

// Remove the sensitive/useless fields from the response
function stripUserValues(user: AppUser) {
  const { password, ...rest } = user.dataValues
  return rest
}

export default userController

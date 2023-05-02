import { NextFunction, Request, Response, Router } from "express";
import AppUser from "../models/AppUser.model";
import { AppUserSchema } from "../validators/AppUser.validator";
import { ErrorWithStatus } from "../middlewares/errorWithStatus";

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
      next(new ErrorWithStatus("No users found", 404))
      return;
    }
    const strippedUsers = users.map(user => stripUserValues(user))
    res.status(200).json(strippedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
});

// GET one user
userController.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await AppUser.findByPk(req.params.id);
    if (!user) {
      next(new ErrorWithStatus("User not found", 404))
      return;
    }
    res.status(200).json({
      user_id: user.user_id,
      email: user.email,
      nickname: user.nickname,
      is_admin: user.is_admin, 
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Error fetching user" });
  }
});

// Remove the sensitive/useless fields from the response
function stripUserValues(user: AppUser) {
  const { password, is_admin, ...rest } = user.dataValues
  return rest
}

export default userController

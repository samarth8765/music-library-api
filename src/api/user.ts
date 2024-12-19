import { Router } from "express";
import { AuthenticateToken, Authorize } from "../middlewares";
import { UserController } from "../controller";

export const UserRoutes = Router();

UserRoutes.get(
	"/",
	AuthenticateToken,
	Authorize(["Admin"]),
	UserController.GetAllUsers,
);

UserRoutes.post(
	"/add-user",
	AuthenticateToken,
	Authorize(["Admin"]),
	UserController.AddUser,
);

UserRoutes.delete(
	"/:id",
	AuthenticateToken,
	Authorize(["Admin"]),
	UserController.DeleteUser,
);

UserRoutes.put(
	"/update-password",
	AuthenticateToken,
	Authorize(["Admin", "Editor", "Viewer"]),
	UserController.UpdatePassword,
);

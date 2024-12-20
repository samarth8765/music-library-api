import { Router } from "express";
import { IdentityController } from "../controller";
import { AuthenticateToken } from "../middlewares";

export const IdentityRoutes = Router();

IdentityRoutes.post("/signup", IdentityController.Signup);
IdentityRoutes.post("/login", IdentityController.Login);
IdentityRoutes.get("/logout", AuthenticateToken, IdentityController.Logout);

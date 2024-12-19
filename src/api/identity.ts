import { Router } from "express";
import { IdentityController } from "../controller";

export const IdentityRoutes = Router();

IdentityRoutes.post("/signup", IdentityController.Signup);
IdentityRoutes.post("/login", IdentityController.Login);
IdentityRoutes.post("/logout", IdentityController.Logout);

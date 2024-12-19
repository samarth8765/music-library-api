import { Router } from "express";
import { AuthenticateToken, Authorize } from "../middlewares";
import { FavoriteController } from "../controller/favorite";

export const FavoriteRoutes = Router();

FavoriteRoutes.get(
	"/:category",
	AuthenticateToken,
	Authorize(["Admin", "Editor", "Viewer"]),
	FavoriteController.GetAllFavorites,
);

FavoriteRoutes.post(
	"/add-favorite",
	AuthenticateToken,
	Authorize(["Admin", "Editor", "Viewer"]),
	FavoriteController.AddFavorite,
);

FavoriteRoutes.delete(
	"/remove-favorite/:id",
	AuthenticateToken,
	Authorize(["Admin", "Editor", "Viewer"]),
	FavoriteController.RemoveFavorite,
);

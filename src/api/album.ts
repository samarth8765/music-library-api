import { Router } from "express";
import { AuthenticateToken, Authorize } from "../middlewares";
import { AlbumController } from "../controller/album";

export const AlbumRoutes = Router();

AlbumRoutes.get(
	"/",
	AuthenticateToken,
	Authorize(["Admin", "Editor", "Viewer"]),
	AlbumController.GetAllAlbums,
);

AlbumRoutes.get(
	"/:id",
	AuthenticateToken,
	Authorize(["Admin", "Editor", "Viewer"]),
	AlbumController.GetAlbumById,
);

AlbumRoutes.post(
	"/add-album",
	AuthenticateToken,
	Authorize(["Admin", "Editor"]),
	AlbumController.AddAlbum,
);

AlbumRoutes.put(
	"/:id",
	AuthenticateToken,
	Authorize(["Admin", "Editor"]),
	AlbumController.UpdateAlbum,
);

AlbumRoutes.delete(
	"/:id",
	AuthenticateToken,
	Authorize(["Admin", "Editor"]),
	AlbumController.DeleteAlbum,
);

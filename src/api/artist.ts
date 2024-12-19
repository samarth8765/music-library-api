import { Router } from "express";
import { AuthenticateToken, Authorize } from "../middlewares";
import { ArtistController } from "../controller";

export const ArtistRoutes = Router();

ArtistRoutes.get(
	"/",
	AuthenticateToken,
	Authorize(["Admin", "Editor", "Viewer"]),
	ArtistController.GetAllArtist,
);

ArtistRoutes.get(
	"/:id",
	AuthenticateToken,
	Authorize(["Admin", "Editor", "Viewer"]),
	ArtistController.GetArtistById,
);

ArtistRoutes.post(
	"/add-artist",
	AuthenticateToken,
	Authorize(["Admin", "Editor"]),
	ArtistController.AddArtist,
);

ArtistRoutes.put(
	"/:id",
	AuthenticateToken,
	Authorize(["Admin", "Editor"]),
	ArtistController.UpdateArtist,
);

ArtistRoutes.delete(
	"/:id",
	AuthenticateToken,
	Authorize(["Admin", "Editor"]),
	ArtistController.DeleteArtist,
);

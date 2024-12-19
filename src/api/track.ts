import { Router } from "express";
import { TrackController } from "../controller/track";
import { AuthenticateToken, Authorize } from "../middlewares";

export const TrackRoutes = Router();

TrackRoutes.get(
	"/",
	AuthenticateToken,
	Authorize(["Admin", "Editor", "Viewer"]),
	TrackController.GetAllTracks,
);

TrackRoutes.get(
	"/:id",
	AuthenticateToken,
	Authorize(["Admin", "Editor", "Viewer"]),
	TrackController.GetTrackById,
);

TrackRoutes.post(
	"/add-Track",
	AuthenticateToken,
	Authorize(["Admin", "Editor"]),
	TrackController.AddTrack,
);

TrackRoutes.put(
	"/:id",
	AuthenticateToken,
	Authorize(["Admin", "Editor"]),
	TrackController.UpdateTrack,
);

TrackRoutes.delete(
	"/:id",
	AuthenticateToken,
	Authorize(["Admin", "Editor"]),
	TrackController.DeleteTrack,
);

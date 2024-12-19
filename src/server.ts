import express from "express";
import "express-async-errors";
import type { Request, Response } from "express";
import {
	AlbumRoutes,
	ArtistRoutes,
	IdentityRoutes,
	TrackRoutes,
	UserRoutes,
} from "./api";
import { GlobalErrorHandler } from "./middlewares";
import { logRequests, NotFoundError } from "./utils";
import { FavoriteRoutes } from "./api/favorite";
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(logRequests);

app.get("/api/v1/ping", (_request: Request, response: Response) => {
	return response.status(200).json({
		message: "PONG",
	});
});

app.use("/api/v1", IdentityRoutes);
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/artists", ArtistRoutes);
app.use("/api/v1/albums", AlbumRoutes);
app.use("/api/v1/tracks", TrackRoutes);
app.use("/api/v1/favorites", FavoriteRoutes);

app.all("*", () => {
	throw new NotFoundError("Route not found");
});

app.use(GlobalErrorHandler);

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});

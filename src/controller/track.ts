import type { Request, Response } from "express";
import {
	BadRequestError,
	db,
	NotFoundError,
	PaginationSchema,
	TrackSchema,
	UpdateTrackSchema,
} from "../utils";

const GetAllTracks = async (request: Request, response: Response) => {
	const { limit = 5, offset = 0, artist_id, album_id, hidden } = request.query;

	if (!PaginationSchema.safeParse(request.query).success) {
		throw new BadRequestError("Invalid Pagination Query");
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const filters: any = {};

	if (artist_id) {
		const artist = await db.artist.findUnique({
			where: {
				artist_id: artist_id as string,
			},
		});

		if (artist) {
			filters.artist = {
				artist_id: artist.artist_id,
			};
		}
	}

	if (album_id) {
		const album = await db.album.findUnique({
			where: {
				album_id: album_id as string,
			},
		});

		if (album) {
			filters.album = {
				album_id: album.album_id,
			};
		}
	}

	if (hidden !== undefined && ["true", "false"].includes(hidden as string)) {
		filters.hidden = hidden === "true";
	}

	const tracks = await db.track.findMany({
		where: filters,
		skip: Number(offset),
		take: Number(limit),
		select: {
			track_id: true,
			name: true,
			duration: true,
			hidden: true,
			artist: {
				select: {
					name: true,
				},
			},
			album: {
				select: {
					name: true,
				},
			},
		},
	});

	const formattedTracks = tracks.map((track) => ({
		track_id: track.track_id,
		artist_name: track.artist?.name,
		album_name: track.album?.name,
		name: track.name,
		duration: track.duration,
		hidden: track.hidden,
	}));

	return response.status(200).json({
		status: 200,
		data: formattedTracks,
		message: "Tracks Fetched Successfully",
		error: null,
	});
};

const GetTrackById = async (request: Request, response: Response) => {
	const { id } = request.params;

	const track = await db.track.findUnique({
		where: {
			track_id: id,
		},
		select: {
			track_id: true,
			name: true,
			duration: true,
			hidden: true,
			artist: {
				select: {
					name: true,
				},
			},
			album: {
				select: {
					name: true,
				},
			},
		},
	});

	if (!track) {
		throw new NotFoundError("Track Not Found");
	}

	const formattedTrack = {
		track_id: track.track_id,
		artist_name: track.artist?.name,
		album_name: track.album?.name,
		name: track.name,
		duration: track.duration,
		hidden: track.hidden,
	};

	return response.status(200).json({
		status: 200,
		data: formattedTrack,
		message: "Track Fetched Successfully",
		error: null,
	});
};

const AddTrack = async (request: Request, response: Response) => {
	const { artist_id, album_id, name, duration, hidden } = request.body;

	if (!TrackSchema.safeParse(request.body).success) {
		throw new BadRequestError("Invalid Request Body");
	}

	const artist = await db.artist.findUnique({
		where: {
			artist_id,
		},
	});

	const album = await db.album.findUnique({
		where: {
			album_id,
		},
	});

	if (!(artist && album)) {
		throw new NotFoundError("Artist or Album Not Found");
	}

	await db.track.create({
		data: {
			artist_id,
			album_id,
			name,
			duration,
			hidden,
		},
	});

	return response.status(201).json({
		status: 201,
		data: null,
		message: "Track Added Successfully",
		error: null,
	});
};

const UpdateTrack = async (request: Request, response: Response) => {
	const { id } = request.params;
	const { name, duration, hidden } = request.body;

	if (!UpdateTrackSchema.safeParse(request.body).success) {
		throw new BadRequestError("Invalid Request Body");
	}

	const track = await db.track.findUnique({
		where: {
			track_id: id,
		},
	});

	if (!track) {
		throw new NotFoundError("Track Not Found");
	}

	await db.track.update({
		where: {
			track_id: id,
		},
		data: {
			name,
			duration,
			hidden,
		},
	});

	return response.status(204).json({
		status: 204,
		data: null,
		message: "Track Updated Successfully",
		error: null,
	});
};

const DeleteTrack = async (request: Request, response: Response) => {
	const { id } = request.params;

	const track = await db.track.findUnique({
		where: {
			track_id: id,
		},
	});

	if (!track) {
		throw new NotFoundError("Track Not Found");
	}

	await db.track.delete({
		where: {
			track_id: id,
		},
	});

	return response.status(200).json({
		status: 200,
		data: null,
		message: `Track: ${track.name} Deleted Successfully`,
		error: null,
	});
};

export const TrackController = {
	GetAllTracks,
	GetTrackById,
	AddTrack,
	UpdateTrack,
	DeleteTrack,
};

import type { Request, Response } from "express";
import {
	BadRequestError,
	db,
	NotFoundError,
	TrackSchema,
	UpdateTrackSchema,
} from "../utils";

const GetAllTracks = async (request: Request, response: Response) => {
	const tracks = await db.track.findMany({
		select: {
			track_id: true,
			name: true,
			duration: true,
			hidden: true,
		},
	});

	return response.status(200).json({
		status: 200,
		data: tracks,
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
		},
	});

	if (!track) {
		throw new NotFoundError("Track Not Found");
	}

	return response.status(200).json({
		status: 200,
		data: track,
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

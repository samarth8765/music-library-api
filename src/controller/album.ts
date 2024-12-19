import type { Request, Response } from "express";
import {
	AlbumSchema,
	BadRequestError,
	db,
	NotFoundError,
	UpdateAlbumSchema,
} from "../utils";

const GetAllAlbums = async (request: Request, response: Response) => {
	const { limit = 5, offset = 0, artist_id, hidden } = request.query;

	const albums = await db.album.findMany({
		where: {
			artist: {
				artist_id: String(artist_id),
			},
		},
		skip: Number(offset),
		take: Number(limit),
		select: {
			album_id: true,
			name: true,
			year: true,
			hidden: true,
		},
	});

	return response.status(200).json({
		status: 200,
		data: albums,
		message: "Albums retrieved Successfully",
		error: null,
	});
};

const GetAlbumById = async (request: Request, response: Response) => {
	const { id } = request.params;

	const album = await db.album.findUnique({
		where: {
			album_id: id,
		},
		include: {
			artist: {
				select: {
					name: true,
				},
			},
		},
	});

	if (!album) {
		throw new NotFoundError("Album Doesn't Exist");
	}

	return response.status(200).json({
		status: 200,
		data: {
			aldum_id: album.album_id,
			artist_name: album.artist.name,
			name: album.name,
			year: album.year,
			hidden: album.hidden,
		},
		message: null,
		error: null,
	});
};

const AddAlbum = async (request: Request, response: Response) => {
	const { artist_id, name, year, hidden } = request.body;

	if (!AlbumSchema.safeParse(request.body).success) {
		throw new BadRequestError("Invalid Request Body");
	}

	const artist = await db.artist.findUnique({
		where: {
			artist_id,
		},
	});

	if (!artist) {
		throw new NotFoundError("Artist Doesn't Exist");
	}

	await db.album.create({
		data: {
			artist_id,
			name,
			year,
			hidden,
		},
	});

	return response.status(201).json({
		status: 201,
		data: null,
		message: "Album Added Successfully",
		error: null,
	});
};

const UpdateAlbum = async (request: Request, response: Response) => {
	const { id } = request.params;
	const { name, year, hidden } = request.body;

	if (!UpdateAlbumSchema.safeParse(request.body).success) {
		throw new BadRequestError("Invalid Request Body");
	}

	const album = await db.album.findUnique({
		where: {
			album_id: id,
		},
	});

	if (!album) {
		throw new NotFoundError("Album Doesn't Exist");
	}

	await db.album.update({
		where: {
			album_id: id,
		},
		data: {
			name,
			year,
			hidden,
		},
	});

	return response.status(204).json({
		status: 204,
		data: null,
		message: "Album Updated Successfully",
		error: null,
	});
};

const DeleteAlbum = async (request: Request, response: Response) => {
	const { id } = request.params;

	const album = await db.album.findUnique({
		where: {
			album_id: id,
		},
	});

	if (!album) {
		throw new NotFoundError("Album Doesn't Exist");
	}

	await db.album.delete({
		where: {
			album_id: id,
		},
	});

	return response.status(200).json({
		status: 200,
		data: null,
		message: `Album: ${album.name} Deleted Successfully`,
		error: null,
	});
};

export const AlbumController = {
	GetAllAlbums,
	GetAlbumById,
	AddAlbum,
	UpdateAlbum,
	DeleteAlbum,
};

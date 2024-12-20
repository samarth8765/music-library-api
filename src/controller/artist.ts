import type { Request, Response } from "express";
import {
	ArtistSchema,
	BadRequestError,
	db,
	NotFoundError,
	PaginationSchema,
	UpdateArtistSchema,
} from "../utils";

const GetAllArtist = async (request: Request, response: Response) => {
	const { limit = 5, offset = 0, grammy, hidden } = request.query;

	if (!PaginationSchema.safeParse(request.query).success) {
		throw new BadRequestError("Invalid Pagination Query");
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const filters: any = {};
	if (grammy !== undefined && Number(grammy) && Number(grammy) >= 0)
		filters.grammy = Number(grammy);
	if (hidden !== undefined && ["true", "false"].includes(hidden as string)) {
		filters.hidden = hidden === "true";
	}

	const artists = await db.artist.findMany({
		where: filters,
		skip: Number(offset),
		take: Number(limit),
		select: {
			artist_id: true,
			name: true,
			grammy: true,
			hidden: true,
		},
	});

	return response.status(200).json({
		status: true,
		data: artists,
		message: "Artist Fetched Successfully",
		error: null,
	});
};

const GetArtistById = async (request: Request, response: Response) => {
	const { id } = request.params;

	const artist = await db.artist.findUnique({
		where: {
			artist_id: id,
		},
		select: {
			artist_id: true,
			name: true,
			grammy: true,
			hidden: true,
		},
	});

	if (!artist) {
		throw new NotFoundError("Artist Not Found");
	}

	return response.status(200).json({
		status: true,
		data: artist,
		message: "Artist retrieved Successfully",
		error: null,
	});
};

const AddArtist = async (request: Request, response: Response) => {
	const { name, grammy, hidden } = request.body;

	if (!ArtistSchema.safeParse(request.body).success) {
		throw new BadRequestError("Invalid Request Body");
	}

	await db.artist.create({
		data: {
			name,
			grammy,
			hidden,
		},
	});

	return response.status(201).json({
		status: 201,
		data: null,
		message: "Artist Created Successfully",
		error: null,
	});
};

const UpdateArtist = async (request: Request, response: Response) => {
	const { id } = request.params;
	const { name, grammy, hidden } = request.body;

	if (!UpdateArtistSchema.safeParse(request.body).success) {
		throw new BadRequestError("Invalid Request Body");
	}

	const artistExists = await db.artist.findUnique({
		where: {
			artist_id: id,
		},
	});

	if (!artistExists) {
		throw new NotFoundError("Artist Not Found");
	}

	await db.artist.update({
		where: {
			artist_id: id,
		},
		data: {
			name,
			grammy,
			hidden,
		},
	});

	return response.status(204).send();
};

const DeleteArtist = async (request: Request, response: Response) => {
	const { id } = request.params;
	const artistExists = await db.artist.findUnique({
		where: {
			artist_id: id,
		},
	});

	if (!artistExists) {
		throw new NotFoundError("Artist Not Found");
	}

	const artist = await db.artist.delete({
		where: {
			artist_id: id,
		},
	});

	return response.status(200).json({
		status: 200,
		data: {
			artist_id: artist.artist_id,
		},
		message: `Artist: ${artist.name} Deleted Successfully`,
		error: null,
	});
};

export const ArtistController = {
	GetAllArtist,
	GetArtistById,
	AddArtist,
	UpdateArtist,
	DeleteArtist,
};

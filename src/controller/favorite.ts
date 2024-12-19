import type { Request, Response } from "express";
import { FavoriteSchema, BadRequestError, NotFoundError, db } from "../utils";
import type { Album, Artist, Category, Track } from "@prisma/client";

export const GetAllFavorites = async (request: Request, response: Response) => {
	const { category } = request.params;
	const { limit = 5, offset = 0 } = request.query;

	//@ts-ignore
	const user_id = request.user.id;

	if (!FavoriteSchema.partial().safeParse(request.params).success) {
		throw new BadRequestError("Invalid Request Params");
	}

	const favorites = await db.favorite.findMany({
		where: {
			category: category as Category,
			user_id,
		},
		skip: Number(offset),
		take: Number(limit),
		select: {
			favorite_id: true,
			user_id: true,
			category: true,
			item_id: true,
			Artist: { select: { name: true } },
			Album: { select: { name: true } },
			Track: { select: { name: true } },
		},
	});

	console.log(favorites);

	const formattedFavorites = favorites.map((fav) => ({
		favorite_id: fav.favorite_id,
		user_id: fav.user_id,
		category: fav.category,
		item_id: fav.item_id,
		name: fav.Artist?.name || fav.Album?.name || fav.Track?.name,
	}));

	return response.status(200).json({
		status: 200,
		data: formattedFavorites,
		message: "Favorites Fetched Successfully",
		error: null,
	});
};

const AddFavorite = async (request: Request, response: Response) => {
	const { category, item_id } = request.body;
	//@ts-ignore
	const user_id = request.user.id;

	if (!FavoriteSchema.safeParse(request.body).success) {
		throw new BadRequestError("Invalid Request Body");
	}

	let itemExists: Artist | Track | Album | null = null;
	switch (category) {
		case "artist":
			itemExists = await db.artist.findUnique({
				where: { artist_id: item_id },
			});
			break;
		case "album":
			itemExists = await db.album.findUnique({ where: { album_id: item_id } });
			break;
		case "track":
			itemExists = await db.track.findUnique({ where: { track_id: item_id } });
			break;
	}
	if (!itemExists) {
		throw new NotFoundError("The category item does not exist.");
	}

	await db.favorite.create({
		data: {
			user_id,
			category: category as Category,
			item_id,
		},
	});

	return response.status(201).json({
		status: 201,
		data: null,
		message: "Favorite Added Successfully",
		error: null,
	});
};

const RemoveFavorite = async (request: Request, response: Response) => {
	const { id } = request.params;

	//@ts-ignore
	const user_id = request.user.id;

	const favorite = await db.favorite.findUnique({
		where: {
			favorite_id: id,
			user_id,
		},
	});

	if (!favorite) {
		throw new NotFoundError("Favorite Not Found");
	}

	await db.favorite.delete({
		where: {
			favorite_id: id,
		},
	});

	return response.status(200).json({
		status: 200,
		data: null,
		message: "Favorite removed Successfully",
		error: null,
	});
};

export const FavoriteController = {
	GetAllFavorites,
	AddFavorite,
	RemoveFavorite,
};

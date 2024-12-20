import z from "zod";

export const PaginationSchema = z.object({
	limit: z
		.string()
		.transform((value) => Number(value))
		.refine((value) => !Number.isNaN(value) && value >= 0, {
			message: "'limit' must be a positive number",
		})
		.optional(),
	offset: z
		.string()
		.transform((value) => Number(value))
		.refine((value) => !Number.isNaN(value) && value >= 0, {
			message: "'offset' must be a non-negative number",
		})
		.optional(),
});

export const IdentitySchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

export const UserSchema = z.object({
	email: z.string().email(),
	password: z.string(),
	role: z.enum(["Editor", "Viewer"]),
});

export const UserUpdatePasswordSchema = z.object({
	old_password: z.string(),
	new_password: z.string(),
});

export const QueryArtistSchema = z.object({
	hidden: z.enum(["true", "false"]).optional(),
	grammy: z.number().nonnegative().optional(),
});

export const ArtistSchema = z.object({
	name: z.string(),
	grammy: z.number().nonnegative(),
	hidden: z.boolean(),
});

export const UpdateArtistSchema = ArtistSchema.partial();

export const AlbumSchema = z.object({
	artist_id: z.string(),
	name: z.string(),
	year: z.number().nonnegative(),
	hidden: z.boolean(),
});

export const UpdateAlbumSchema = AlbumSchema.partial();

export const TrackSchema = z.object({
	artist_id: z.string(),
	album_id: z.string(),
	name: z.string(),
	duration: z.number().positive(),
	hidden: z.boolean(),
});

export const UpdateTrackSchema = TrackSchema.partial();

export const FavoriteSchema = z.object({
	category: z.enum(["artist", "album", "track"]),
	item_id: z.string(),
});

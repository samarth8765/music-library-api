import z from "zod";

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

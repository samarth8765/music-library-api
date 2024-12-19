import { db } from "../src/utils";

const scritpt = async () => {
	await db.album.deleteMany();
	await db.artist.deleteMany();
	await db.track.deleteMany();
	await db.favorite.deleteMany();
};

scritpt();

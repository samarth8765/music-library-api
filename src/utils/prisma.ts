import { PrismaClient } from "@prisma/client";

class DBClient {
	private static DB: PrismaClient | null = null;

	private constructor() {}

	public static getInstance() {
		if (DBClient.DB === null) {
			DBClient.DB = new PrismaClient();
		}
		return DBClient.DB;
	}
}

export const db = DBClient.getInstance();

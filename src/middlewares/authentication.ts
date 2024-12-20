import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "../utils";
import { redisClient } from "../services";

export const AuthenticateToken = async (
	request: Request,
	_response: Response,
	next: NextFunction,
) => {
	const token = request.header("Authorization")?.split(" ")[1];
	if (!token) throw new UnauthorizedError();

	try {
		const isBlacklisted = await redisClient.get(token);
		if (isBlacklisted) {
			throw new UnauthorizedError();
		}

		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET as string,
		) as JwtPayload;
		//@ts-ignore
		request.user = { id: decoded.id, role: decoded.role };
		next();
	} catch (err) {
		throw new UnauthorizedError();
	}
};

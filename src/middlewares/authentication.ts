import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "../utils";

export const AuthenticateToken = (
	request: Request,
	response: Response,
	next: NextFunction,
) => {
	const token = request.header("Authorization")?.split(" ")[1];
	if (!token) throw new UnauthorizedError();

	try {
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

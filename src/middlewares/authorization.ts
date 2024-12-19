import { ForbiddenError, type Role } from "../utils";
import type { Request, Response, NextFunction } from "express";

export const Authorize = (roles: Role[]) => {
	return (request: Request, response: Response, next: NextFunction) => {
		//@ts-ignore
		if (!request.user || !roles.includes(request.user.role)) {
			throw new ForbiddenError();
		}
		next();
	};
};

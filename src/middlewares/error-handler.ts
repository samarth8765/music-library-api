import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils";

export const GlobalErrorHandler = (
	error: AppError | Error,
	_request: Request,
	response: Response,
	_next: NextFunction,
) => {
	if (error instanceof AppError) {
		return response.status(error.statusCode).json({
			status: error.statusCode,
			data: null,
			message: null,
			error: error.message,
		});
	}

	// Log unexpected errors
	console.error("Unexpected Error:", error);

	response.status(500).json({
		status: 500,
		data: null,
		message: null,
		error: "Internal Server Error",
	});
};

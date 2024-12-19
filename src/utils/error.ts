export class AppError extends Error {
	public statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;

		Error.captureStackTrace(this, this.constructor);
	}
}

export class BadRequestError extends AppError {
	constructor(message = "Bad Request") {
		console.log(message);
		super(message, 400);
	}
}

export class UnauthorizedError extends AppError {
	constructor(message = "Unauthorized Access") {
		super(message, 401);
	}
}

export class ForbiddenError extends AppError {
	constructor(message = "Forbidden Access") {
		super(message, 403);
	}
}

export class ConflictError extends AppError {
	constructor(message = "Conflict") {
		super(message, 409);
	}
}

export class NotFoundError extends AppError {
	constructor(message = "Not Found") {
		super(message, 404);
	}
}

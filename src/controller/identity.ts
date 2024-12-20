import type { NextFunction, Request, Response } from "express";
import {
	BadRequestError,
	ConflictError,
	IdentitySchema,
	NotFoundError,
	UnauthorizedError,
} from "../utils";
import { compare, hash } from "bcrypt";
import { type JwtPayload, sign, verify } from "jsonwebtoken";
import { db } from "../utils";
import { redisClient } from "../services";

const Signup = async (request: Request, response: Response) => {
	const { email, password } = request.body;

	if (!IdentitySchema.safeParse(request.body).success) {
		throw new BadRequestError(
			"Bad Request, Reason: Either Email or Password is missing",
		);
	}

	const userExists = await db.user.findUnique({
		where: {
			email,
		},
	});

	if (userExists) {
		throw new ConflictError("Email already exists.");
	}

	const hashPassword = await hash(password, 10);

	const isFirstUser = (await db.user.count()) === 0;

	const role = isFirstUser ? "Admin" : "Viewer";

	await db.user.create({
		data: {
			email: email,
			password: hashPassword,
			role,
		},
	});

	return response.status(201).json({
		status: 201,
		data: null,
		message: "User Created Successfully",
		error: null,
	});
};

const Login = async (
	request: Request,
	response: Response,
	next: NextFunction,
) => {
	const { email, password } = request.body;

	if (!IdentitySchema.safeParse(request.body).success) {
		throw new BadRequestError(
			"Bad Request, Reason: Email or Password is Missing",
		);
	}

	const userExists = await db.user.findUnique({
		where: {
			email,
		},
	});

	if (!userExists) {
		throw new NotFoundError("Email doesn't exists.");
	}

	const isPasswordValid = await compare(password, userExists.password);
	if (!isPasswordValid) {
		throw new UnauthorizedError("Invalid Password.");
	}

	const token = sign(
		{ id: userExists.id, role: userExists.role },
		process.env.JWT_SECRET as string,
		{ expiresIn: "24h" },
	);

	return response.status(200).json({
		status: 200,
		data: {
			token,
		},
		message: "Login Successful.",
		error: null,
	});
};

const Logout = async (request: Request, response: Response) => {
	const token = request.header("Authorization")?.split(" ")[1];
	if (!token) {
		throw new UnauthorizedError();
	}

	const decoded = verify(token, process.env.JWT_SECRET as string) as JwtPayload;

	if (!decoded.exp) {
		throw new UnauthorizedError();
	}

	const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

	await redisClient.set(token, "blacklisted", {
		EX: expiresIn,
	});

	return response.status(200).json({
		status: 200,
		data: null,
		message: "User logged out successfully",
		error: null,
	});
};

export const IdentityController = { Signup, Login, Logout };

import type { Request, Response } from "express";
import {
	BadRequestError,
	ConflictError,
	db,
	NotFoundError,
	PaginationSchema,
	UserSchema,
	UserUpdatePasswordSchema,
	type Role,
} from "../utils";
import { compare, hash } from "bcrypt";

const GetAllUsers = async (request: Request, response: Response) => {
	const { limit = 5, offset = 0, role } = request.query;

	if (!PaginationSchema.safeParse(request.query).success) {
		throw new BadRequestError("Invalid Pagination Query");
	}

	const validRoles = ["Editor", "Viewer"];

	if (role && !validRoles.includes(role as Role)) {
		throw new BadRequestError(
			"Bad Request, Reason: Role should be Editor or Viewer",
		);
	}

	const users = await db.user.findMany({
		where: {
			role: role as Role,
		},
		take: Number(limit),
		skip: Number(offset),
		select: {
			id: true,
			email: true,
			role: true,
			createdAt: true,
		},
	});

	return response.status(200).json({
		status: 200,
		data: users,
		message: "Users retrieved Successfully",
		error: null,
	});
};

const AddUser = async (request: Request, response: Response) => {
	const { email, password, role } = request.body;

	if (!UserSchema.safeParse(request.body).success) {
		throw new BadRequestError(
			"Bad Request, Reason : email, password or correct role is missing",
		);
	}

	const userExists = await db.user.findUnique({
		where: {
			email,
		},
	});

	if (userExists) {
		throw new ConflictError("Email Already Exists");
	}

	const hashedPassword = await hash(password, 10);

	await db.user.create({
		data: {
			email: email,
			password: hashedPassword,
			role: role,
		},
	});

	return response.status(201).json({
		status: 201,
		data: null,
		message: "User Created Successfully",
		error: null,
	});
};

const DeleteUser = async (request: Request, response: Response) => {
	const { id } = request.params;

	const userExists = await db.user.findUnique({
		where: {
			id,
		},
	});

	if (!userExists) {
		throw new NotFoundError("User not found.");
	}

	await db.user.delete({
		where: {
			id,
		},
	});

	return response.status(200).json({
		status: 200,
		data: null,
		message: "User Deleted Successfully",
		error: null,
	});
};

const UpdatePassword = async (request: Request, response: Response) => {
	const { old_password, new_password } = request.body;

	if (!UserUpdatePasswordSchema.safeParse(request.body).success) {
		throw new BadRequestError(
			"Bad Request, Reason: old_password or new_password is missing",
		);
	}

	//@ts-ignore
	const userId = request.user.id;

	const user = await db.user.findUnique({
		where: {
			id: userId,
		},
	});

	if (!user) {
		throw new NotFoundError("User not found.");
	}
	const isPasswordValid = await compare(old_password, user.password);

	if (!isPasswordValid) {
		throw new BadRequestError("Bad Request, Reason: Incorrect Password");
	}

	const hashedPassword = await hash(new_password, 10);

	await db.user.update({
		where: { id: userId },
		data: { password: hashedPassword },
	});

	return response.status(204).send();
};

export const UserController = {
	GetAllUsers,
	AddUser,
	DeleteUser,
	UpdatePassword,
};

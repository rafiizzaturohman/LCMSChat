import * as bcrypt from "bcrypt";
import {
	Injectable,
	UnauthorizedException,
	BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { RegisterAuthDto } from "./dto/register-auth.dto/register-auth.dto";
import { UpdateAuthDto } from "./dto/register-auth.dto/update-auth.dto";

import { PrismaService } from "src/prisma/prisma.service";
import { LoginAuthDto } from "./dto/login-auth.dto/login-auth.dto";
import { Role } from "@prisma/client";

interface JwtPayload {
	sub: number;
	email: string;
	role: Role;
	nip: string | null;
	nim: string | null;
	nidn: string | null;
}

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
	) {}

	async findAll(role?: Role) {
		try {
			const getAllData = await this.prisma.user.findMany({
				where: role ? { role } : undefined,
			});

			return { getAllData };
		} catch (error) {
			console.error(error);
			return error;
		}
	}

	async findOne(id: number) {
		try {
			const getOneData = await this.prisma.user.findUniqueOrThrow({
				where: { id },
			});
			return getOneData;
		} catch (error) {
			return error;
		}
	}

	async login(auth: LoginAuthDto) {
		const existingUser = await this.prisma.user.findUnique({
			where: { email: auth.email },
		});

		if (!existingUser) {
			throw new UnauthorizedException("Invalid email or password");
		}

		const passwordValid = await bcrypt.compare(
			auth.password,
			existingUser.password,
		);

		if (!passwordValid) {
			throw new UnauthorizedException("Invalid email or password");
		}

		if (existingUser.role === "ADMIN") {
			const payload: JwtPayload = {
				sub: existingUser.id,
				email: existingUser.email,
				role: existingUser.role,
				nip: existingUser.nip,
				nim: null,
				nidn: null,
			};

			const jwtToken = this.jwtService.sign(payload);

			return {
				access_token: jwtToken,
				user: {
					id: existingUser.id,
					name: existingUser.name,
					email: existingUser.email,
					role: existingUser.role,
					nip: existingUser.nip,
				},
			};
		} else if (existingUser.role === "LECTURER") {
			const payload: JwtPayload = {
				sub: existingUser.id,
				email: existingUser.email,
				role: existingUser.role,
				nip: null,
				nim: null,
				nidn: existingUser.nidn,
			};

			const jwtToken = this.jwtService.sign(payload);

			return {
				access_token: jwtToken,
				user: {
					id: existingUser.id,
					name: existingUser.name,
					email: existingUser.email,
					role: existingUser.role,
					nidn: existingUser.nidn,
				},
			};
		} else {
			const payload: JwtPayload = {
				sub: existingUser.id,
				email: existingUser.email,
				role: existingUser.role,
				nip: null,
				nim: existingUser.nim,
				nidn: null,
			};

			const jwtToken = this.jwtService.sign(payload);

			return {
				access_token: jwtToken,
				user: {
					id: existingUser.id,
					name: existingUser.name,
					email: existingUser.email,
					role: existingUser.role,
					nim: existingUser.nim,
				},
			};
		}
	}

	async register(auth: RegisterAuthDto) {
		try {
			const existingUser = await this.prisma.user.findUnique({
				where: { email: auth.email },
			});

			if (existingUser) {
				return { message: "Email is already in use by another account" };
			}

			const hashedPassword = await bcrypt.hash(auth.password, 10);

			const roleData: { nim?: string; nidn?: string; nip?: string } = {};

			if (auth.role === "STUDENT") {
				if (!auth.nim)
					throw new BadRequestException("NIM is required for students");
				roleData.nim = auth.nim;
			} else if (auth.role === "LECTURER") {
				if (!auth.nidn)
					throw new BadRequestException("NIDN is required for lecturers");
				roleData.nidn = auth.nidn;
			} else if (auth.role === "ADMIN") {
				if (!auth.nip)
					throw new BadRequestException("NIP is required for admins");
				roleData.nip = auth.nip;
			}

			const userAuth = await this.prisma.user.create({
				data: {
					email: auth.email,
					name: auth.name,
					password: hashedPassword,
					role: auth.role,
					avatarUrl: auth.avatar ?? null,
					...roleData,
				},
				select: {
					id: true,
					email: true,
					name: true,
					role: true,
					avatarUrl: true,
					createdAt: true,
				},
			});

			return {
				message: "User created successfully",
				user: userAuth,
			};
		} catch (error) {
			console.error(error);
			return {
				message: "Failed to create user",
				error: error.message || error,
			};
		}
	}

	async update(param: { id: number }, updatedUser: UpdateAuthDto) {
		try {
			const getOneData = await this.prisma.user.findUniqueOrThrow({
				where: { id: param.id },
			});

			let hashedPassword: string | undefined;
			if (updatedUser.password) {
				hashedPassword = await bcrypt.hash(updatedUser.password, 10);
			}

			if (updatedUser.email) {
				const existingUser = await this.prisma.user.findUnique({
					where: { email: updatedUser.email },
				});

				if (existingUser && existingUser.id !== param.id) {
					return {
						message: "Email is already in use by another account",
					};
				}
			}

			const roleData: {
				nim?: string | null;
				nidn?: string | null;
				nip?: string | null;
			} = {
				nim: getOneData.nim || updatedUser.nim,
				nidn: getOneData.nidn || updatedUser.nidn,
				nip: getOneData.nip || updatedUser.nip,
			};

			if (updatedUser.role === "STUDENT") {
				if (!updatedUser.nim)
					throw new BadRequestException("NIM is required for students");
				roleData.nim = updatedUser.nim;
			} else if (updatedUser.role === "LECTURER") {
				if (!updatedUser.nidn)
					throw new BadRequestException("NIDN is required for lecturers");
				roleData.nidn = updatedUser.nidn;
			} else if (updatedUser.role === "ADMIN") {
				if (!updatedUser.nip)
					throw new BadRequestException("NIP is required for admins");
				roleData.nip = updatedUser.nip;
			}

			const userAuth = await this.prisma.user.update({
				where: { id: param.id },
				data: {
					email: updatedUser.email,
					name: updatedUser.name,
					password: hashedPassword || getOneData.password,
					role: updatedUser.role,
					avatarUrl: updatedUser.avatar ?? getOneData.avatarUrl,
					...roleData,
				},
				select: {
					id: true,
					email: true,
					name: true,
					role: true,
					avatarUrl: true,
					updatedAt: true,
				},
			});

			return {
				message: "User updated successfully",
				user: userAuth,
			};
		} catch (error) {
			return {
				message: "Failed to update user data",
				error: error.message || error,
			};
		}
	}

	async delete(param: { id: number }) {
		try {
			const getOneData = await this.prisma.user.findUniqueOrThrow({
				where: { id: param.id },
			});

			await this.prisma.user.delete({
				where: { id: getOneData.id },
			});

			return {
				message: "User deleted successfully",
			};
		} catch (error) {
			return {
				message: "Failed to delete user",
				error: error.message || error,
			};
		}
	}
}

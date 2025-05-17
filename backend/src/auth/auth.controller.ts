import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	Req,
	Res,
	UseGuards,
} from "@nestjs/common";

import { AuthService } from "./auth.service";

import { LoginAuthDto } from "./dto/login-auth.dto/login-auth.dto";
import { UpdateAuthDto } from "./dto/register-auth.dto/update-auth.dto";
import { RegisterAuthDto } from "./dto/register-auth.dto/register-auth.dto";
import { Response } from "express";
import { getCookieOptions } from "src/utils/getCookie";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get() // /auth/
	async findAll(@Query("role") role?: "ADMIN" | "LECTURER" | "STUDENT") {
		// /auth?role=ADMIN | LECTURER | STUDENT
		try {
			return await this.authService.findAll(role);
		} catch (error) {
			return {
				message: "Failed to get user data",
				error: error.message || error,
			};
		}
	}

	@Get("profile/:id") // /auth/profile/{id}
	async findOne(@Param("id", ParseIntPipe) id: number) {
		try {
			return this.authService.findOne(id);
		} catch (error) {
			return {
				message: "Failed to find user data",
				error: error.message || error,
			};
		}
	}

	@Post("login") // /auth/login
	async post(
		@Body() LoginAuthDto: LoginAuthDto,
		@Res({ passthrough: true }) res: Response,
	) {
		try {
			const loginAuth = await this.authService.login(LoginAuthDto);

			res.cookie("access_token", loginAuth.access_token, getCookieOptions());

			return {
				message: "Success to log in",
				data: loginAuth.user,
			};
		} catch (error) {
			return {
				message: "Failed to log in",
				error: error.message || error,
			};
		}
	}

	@Post("logout") // /auth/logout
	@HttpCode(200)
	async logout(@Res({ passthrough: true }) res: Response) {
		try {
			res.clearCookie("access_token");

			return {
				message: "Logged out successfully",
			};
		} catch (error) {
			return {
				message: "Failed to log in",
				error: error.message || error,
			};
		}
	}

	@Post("register") // /auth/register
	async create(@Body() RegisterAuthDto: RegisterAuthDto) {
		try {
			return this.authService.register(RegisterAuthDto);
		} catch (error) {
			return {
				message: "Failed to register",
				error: error.message || error,
			};
		}
	}

	@Patch("update/:id") // /auth/update/{id}
	async update(
		@Param("id", ParseIntPipe) id: number,
		@Body() authUpdate: UpdateAuthDto,
	) {
		try {
			return await this.authService.update({ id }, authUpdate);
		} catch (error) {
			return {
				message: "Failed to update user data",
				error: error.message || error,
			};
		}
	}

	@Delete("delete/:id") // /auth/delete/{}
	async delete(@Param("id", ParseIntPipe) id: number) {
		try {
			return await this.authService.delete({ id });
		} catch (error) {
			return {
				message: "Failed to delete user data",
				error: error.message || error,
			};
		}
	}
}

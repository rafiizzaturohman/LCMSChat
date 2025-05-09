import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
} from "@nestjs/common";

import { AuthService } from "./auth.service";

import { LoginAuthDto } from "./dto/login-auth.dto/login-auth.dto";
import { UpdateAuthDto } from "./dto/register-auth.dto/update-auth.dto";
import { RegisterAuthDto } from "./dto/register-auth.dto/register-auth.dto";

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

	@Get(":id") // /auth/{id}
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

	@Post("login") //auth/login
	async post(@Body() LoginAuthDto: LoginAuthDto) {
		try {
			return this.authService.login(LoginAuthDto);
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

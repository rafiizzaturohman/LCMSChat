import { Role } from "@prisma/client";
import {
	IsEmail,
	IsEnum,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from "class-validator";

export class RegisterAuthDto {
	@IsEmail()
	email: string;

	@IsString()
	@MaxLength(80)
	name: string;

	@IsString()
	@MinLength(8)
	password: string;

	@IsEnum(Role)
	role: Role;

	@IsOptional()
	@IsString()
	avatar?: string;

	// Role-based IDs
	@IsOptional()
	@IsString()
	nim?: string; // For students

	@IsOptional()
	@IsString()
	nidn?: string; // For lecturers

	@IsOptional()
	@IsString()
	nip?: string; // For admins
}

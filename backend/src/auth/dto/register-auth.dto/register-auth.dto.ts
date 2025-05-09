import { Role } from "@prisma/client";
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterAuthDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(80)
    name: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsEnum(Role)
    role: Role;

    @IsOptional()
    @IsString()
    avatar?: string;
}

import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginAuthDto {
    @IsEmail()
    email: string;
        
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;    
}

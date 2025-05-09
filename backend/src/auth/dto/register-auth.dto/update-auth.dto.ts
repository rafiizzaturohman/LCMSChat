import { RegisterAuthDto } from "./register-auth.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateAuthDto extends PartialType(RegisterAuthDto) {}

import * as bcrypt from 'bcrypt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { RegisterAuthDto } from './dto/register-auth.dto/register-auth.dto';
import { UpdateAuthDto } from './dto/register-auth.dto/update-auth.dto';

import { PrismaService } from 'src/prisma/prisma.service';
import { LoginAuthDto } from './dto/login-auth.dto/login-auth.dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}
    
    async findAll(role?: 'ADMIN' | 'LECTURER' | 'STUDENT') {
        try {
          const getAllData = await this.prisma.user.findMany({
            where: role ? {role} : undefined
          });

          return {
            getAllData
        };
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async findOne(id: number) {
        try {
            const getOneData = await this.prisma.user.findUniqueOrThrow({
                where: {
                    id: id
                }
            })
            return getOneData;
        } catch (error) {
            return error
        }
    }

    async login(auth: LoginAuthDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: auth.email },
        });

        if (!existingUser) {
            throw new UnauthorizedException('Invalid email or password')
        }

        const passwordValidation = await bcrypt.compare(auth.password, existingUser.password)
        
        if (!passwordValidation) {
            throw new UnauthorizedException('Invalid email or password')
        }

        const payload = {id: existingUser.id, role: existingUser.role, email: existingUser.email}

        const jwtToken = this.jwtService.sign(payload)

        return {
            access_token: jwtToken,
            user: {
                id: existingUser.id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role,
            }
        }
    }

    async register(auth: RegisterAuthDto) {
        try {            
            if (auth.email) {
                const existingUser = await this.prisma.user.findUnique({
                    where: { email: auth.email },
                });
    
                if (existingUser) {
                    return {
                        message: "Email is already in use by another account",
                    };
                }
            }

            const hashedPassword = await bcrypt.hash(auth.password, 10);

            const userAuth = await this.prisma.user.create({
                data: {
                    email: auth.email,
                    name: auth.name,
                    password: hashedPassword,
                    role: auth.role,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    createdAt: true
                }
            })
            return {
                message: "User created successfully",
                user: userAuth
            }
        } catch (error) {
            console.log(error)
            return {
                message: "Failed to Create User",
                error
            }
        }
    }

    async update(param: {id: number}, updatedUser: UpdateAuthDto) {
        try {
            const getOneData = await this.prisma.user.findUniqueOrThrow({
                where: {id: param.id}
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

            const userAuth = await this.prisma.user.update({
                where: {id: param.id},
                data: {
                    email: updatedUser.email,
                    name: updatedUser.name,
                    password: hashedPassword || getOneData.password,
                    role: updatedUser.role,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    updatedAt: true
                }
            })

            return {
                message: "User updated successfully",
                user: userAuth
            }

        } catch (error) {
            return {
                message: "Failed to update user data",
                error: error.message || error
            }
        }
    }

    async delete(param: {id: number}) {
        try {
            const getOneData = await this.prisma.user.findUniqueOrThrow({
                where: {id: param.id}
            });

            await this.prisma.user.delete({where: getOneData})
        } catch (error) {
            
        }
    }
}

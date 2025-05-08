import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Get() // /auth/
    findAll(@Query('role') role?: 'ADMIN' | 'LECTURER' | 'STUDENT') { // /auth?role=ADMIN | LECTURER | STUDENT
        return this.authService.findAll(role)
    }

    @Get(':id') // /auth/{id}
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.authService.findOne(id)
    }
    
    @Post() // /auth/create
    create(@Body() user: {name: string, email: string, role: 'ADMIN' | 'LECTURER' | 'STUDENT'}) {
        return this.authService.create(user)
    }
    
    @Patch(':id') // /auth/update/{id}
    update(@Param('id', ParseIntPipe) id: number, @Body() userUpdate: {name?: string, email?: string, role?: 'ADMIN' | 'LECTURER' | 'STUDENT'}) {
        return this.authService.update(id, userUpdate)
    }

    @Delete(':id') // /auth/delete/{}
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.authService.delete(id)
    }
}

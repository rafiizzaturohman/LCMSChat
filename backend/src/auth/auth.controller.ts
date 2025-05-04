import { Controller, Get, Param } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    @Get()
    findAll() {
        return []
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return { id }
    }
}

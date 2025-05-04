import { Controller, Get, Param } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    @Get()
    fundAll() {
        return []
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return { id }
    }
}

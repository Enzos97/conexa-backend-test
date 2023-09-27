import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeedService } from './seed.service';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from 'src/auth/types/role.type';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Seeds')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get('admin')
  seedAdminExecute() {
    return this.seedService.seedAdmin();
  }

  @ApiBearerAuth()
  @Get('movies')
  @Auth(Role.admin)
  seedExecute(@GetUser() user:User) {
    return this.seedService.seedMoviesExecute(user);
  }
}

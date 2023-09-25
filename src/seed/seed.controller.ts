import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get('admin')
  seedAdminExecute() {
    return this.seedService.seedAdmin();
  }

  @Get('movies')
  seedExecute() {
    return this.seedService.seedMoviesExecute();
  }
}

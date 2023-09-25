import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { MoviesModule } from 'src/movies/movies.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports:[
    MoviesModule
  ]
})
export class SeedModule {}

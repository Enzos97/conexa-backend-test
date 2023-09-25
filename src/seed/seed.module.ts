import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { MoviesModule } from 'src/movies/movies.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports:[
    MoviesModule,
    AuthModule
  ]
})
export class SeedModule {}

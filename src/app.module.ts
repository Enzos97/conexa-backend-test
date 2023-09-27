import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { EmailsModule } from './emails/emails.module';
@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    MongooseModule.forRoot(process.env.DB_URL),
    MoviesModule,
    CommonModule,
    AuthModule,
    SeedModule,
    EmailsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

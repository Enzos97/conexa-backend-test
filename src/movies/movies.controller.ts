import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/types/role.type';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @Auth(Role.admin)
  create(
    @Body() createMovieDto: CreateMovieDto,
    @GetUser() user:User
    ) {
    return this.moviesService.create(createMovieDto,user);
  }

  @Get()
  @Auth(Role.person,Role.admin)
  findAll() {
    return this.moviesService.findAll();
  }

  @Get(':id')
  @Auth(Role.person,Role.admin)
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.moviesService.findOne(id);
  }

  @Patch(':id')
  @Auth(Role.admin)
  update(@Param('id', ParseMongoIdPipe) id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @Auth(Role.admin)
  remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }
}

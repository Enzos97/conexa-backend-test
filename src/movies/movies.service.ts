import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Model } from 'mongoose';
import { Movie } from './entities/movie.entity';
import { InjectModel } from '@nestjs/mongoose';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class MoviesService {

  constructor(
    @InjectModel(Movie.name)
    private readonly movieModel: Model<Movie>,
    private readonly commonService: CommonService,
  ){}

  async create(createMovieDto: CreateMovieDto) {
    try{
      const newMovie = await this.movieModel.create( createMovieDto )
      return newMovie
    }catch(error){
      this.commonService.handleExceptions(error);
    }
  }

  async findAll() {
    try {
      return await this.movieModel.find()
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async findOne(id: string) {
    try {
      const movie = await this.movieModel.findById(id);

      if (!movie) {
        throw new NotFoundException(
          `Could not find movie "${id}". Check that either the id is correct.`,
        );
      }
      return movie;
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    try {
      const movie = await this.movieModel.findByIdAndUpdate(id,updateMovieDto,{new:true})
      return movie
    } catch (error) {
      this.commonService.handleExceptions(error)
    }
  }

  async remove(id: string) {
    try {
      return await this.movieModel.findByIdAndRemove(id)
    } catch (error) {
      this.commonService.handleExceptions(error)
    }
  }
}

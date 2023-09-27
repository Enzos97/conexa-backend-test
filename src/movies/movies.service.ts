import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Model } from 'mongoose';
import { Movie } from './entities/movie.entity';
import { InjectModel } from '@nestjs/mongoose';
import { CommonService } from '../common/common.service';
import { User } from '../auth/entities/user.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class MoviesService {

  constructor(
    @InjectModel(Movie.name)
    private readonly movieModel: Model<Movie>,
    private readonly commonService: CommonService,
  ){}

  async create(createMovieDto: CreateMovieDto, user:User) {
    try{
      const newMovie = await this.movieModel.create( {...createMovieDto, creator:user.id} )
      return newMovie
    }catch(error){
      this.commonService.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 5, offset = 0 } = paginationDto;

      const query = this.movieModel.find({}, { name: 1, release_year: 1, _id: 1 });

      const totalElements: number = await this.movieModel.countDocuments();

      if (offset > 0) {
        query.limit(limit).skip((offset - 1) * limit);
      } else {
        query.limit(limit).skip(offset);
      }
      const maxpages: number = Math.ceil(totalElements / limit);
      const currentpage: number =(offset>0?offset:offset+1)
      const movies = await query.sort({ no: 1 })

      return {movies:movies,totalElements:totalElements, maxpages:maxpages, currentpage:currentpage}
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
      await this.movieModel.findByIdAndRemove(id)
      return "the movie was removed"
    } catch (error) {
      this.commonService.handleExceptions(error)
    }
  }
}

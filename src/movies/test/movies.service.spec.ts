import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from '../movies.service';
import mongoose, { Model } from 'mongoose';
import { Movie } from '../entities/movie.entity';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { User } from '../../auth/entities/user.entity';
import { AuthService } from '../../auth/auth.service';
import { Role } from '../../auth/types/role.type';
import { CommonService } from '../../common/common.service';
import { AppModule } from '../../app.module';
import { MoviesModule } from '../movies.module';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';

describe('MoviesService', () => {
  let moviesService: MoviesService;
  let movieModel: Model<Movie>;

  const mockCreatedMovie = {
    _id: "61c0ccf11d7bf83d153d7c06",
    name: "pelicula1",
    detail: "detail",
    director: "director1",
    release_year: 2023,
    characters: ["character1","characte2"],
    creator: '61c0ccf11d7bf83d153d7c06'
  };

  const mockMovies = [
    {
      "_id": "6510d3f5072c024ed8b13aac",
      "name": "star wars: revenge of the sith",
      "release_year": 2005
    },
    {
      "_id": "6510d3f5072c024ed8b13aa8",
      "name": "star wars: the empire strikes back",
      "release_year": 1980
    },
    {
      "_id": "6510d3f5072c024ed8b13aa6",
      "name": "star wars: return of the jedi",
      "release_year": 1983
    },
    {
      "_id": "6510d3f5072c024ed8b13aa4",
      "name": "star wars: a new hope",
      "release_year": 1977
    },
    {
      "_id": "6510d3f5072c024ed8b13aaa",
      "name": "star wars: the force awakens",
      "release_year": 2015
    }
  ];

  const mockMovieService = {
    find: jest.fn(() => ({
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue(mockMovies),
    })),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndRemove: jest.fn(),
    countDocuments: jest.fn().mockResolvedValue(mockMovies.length),
  };

  const mockPaginationDto = {
    limit: 5,
    offset: 1,
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommonService, 
        MoviesService,
        {
          provide: getModelToken(Movie.name),
          useValue: mockMovieService
        }       
      ],
    }).compile();

    moviesService = module.get<MoviesService>(MoviesService);
    movieModel = module.get<Model<Movie>>(getModelToken(Movie.name));
  });
  describe('findAll', () => {
    it('should return paginated movies', async () => {
      const findAllSpy = jest.spyOn(moviesService, 'findAll');
      const result = await moviesService.findAll(mockPaginationDto);
  
      expect(findAllSpy).toHaveBeenCalledWith(mockPaginationDto);
      expect(result.movies).toEqual(mockMovies);
      expect(result.totalElements).toEqual(5); 
      expect(result.maxpages).toEqual(1);
      expect(result.currentpage).toEqual(1);
    });
  });
  describe('findOne', () => {
        it('should find and return a movie by ID', async () => {
          jest.spyOn(movieModel, 'findById').mockResolvedValue(mockCreatedMovie);
    
          const result = await moviesService.findOne(mockCreatedMovie._id);
    
          expect(movieModel.findById).toHaveBeenCalledWith(mockCreatedMovie._id);
          expect(result).toEqual(mockCreatedMovie);
        });
        it('should throw NotFoundException if movie is not found', async () => {
          jest.spyOn(movieModel, 'findById').mockResolvedValue(null);

          await expect(moviesService.findOne(mockCreatedMovie._id)).rejects.toThrow(
            NotFoundException,
          );

          expect(movieModel.findById).toHaveBeenCalledWith(mockCreatedMovie._id);
    });
  })
  describe('create', () => {
    it('should create and return a movie', async () => {
      const newMovie = {
        name: "pelicula1",
        detail: "detail",
        director: "director1",
        release_year: 2023,
        characters: ["character1","characte2"],
      };

      const mockUser = {
        id: 'user-id',
      };

      const expectedMovie = {
        ...newMovie,
        creator: mockUser.id,
        _id: 'movie-id',
      };

      mockMovieService.create.mockResolvedValueOnce(expectedMovie);

      const result = await moviesService.create(newMovie as CreateMovieDto, mockUser as User);

      expect(mockMovieService.create).toHaveBeenCalledWith({
        ...newMovie,
        creator: mockUser.id,
      });
      expect(result).toEqual(expectedMovie);
    });
  });
  describe('update', () => {
    it('should update a movie and return the updated movie', async () => {
      const movieId = 'movie-id';
      const updateMovieDto = {
        name: 'updated movie',
        detail: 'updated description',
        director: 'updated director',
      };
  
      const expectedMovie = {
        _id: movieId,
        ...updateMovieDto,
        creator: 'user-id',
      };
  
      jest.spyOn(movieModel, 'findByIdAndUpdate').mockResolvedValueOnce(expectedMovie);
  
      const result = await moviesService.update(movieId, updateMovieDto as UpdateMovieDto);
  
      expect(mockMovieService.findByIdAndUpdate).toHaveBeenCalledWith(movieId, updateMovieDto, { new: true });
      expect(result).toEqual(expectedMovie);
    });
  });
  describe('remove', () => {
    it('should remove a movie and return a success message', async () => {
      const movieId = 'movie-id';
  
      jest.spyOn(movieModel, 'findByIdAndRemove').mockResolvedValueOnce(null);
  
      const result = await moviesService.remove(movieId);
  
      expect(mockMovieService.findByIdAndRemove).toHaveBeenCalledWith(movieId);
      expect(result).toBe('the movie was removed');
    });
  });
});

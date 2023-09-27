import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from '../movies.controller';
import { MoviesService } from '../movies.service';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { User } from '../../auth/entities/user.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Category } from '../types/role.type';
import { Movie } from '../entities/movie.entity';
import { PassportModule } from '@nestjs/passport';

describe('MoviesController', () => {
  let moviesController: MoviesController;
  let moviesService: MoviesService;

  const mockMovie = {
    _id: '61c0ccf11d7bf83d153d7c06',
    name: 'New Movie',
    director: 'Director',
    detail: 'Movie Description',
    release_year: 2023,
    characters: ['Character 1', 'Character 2'],
    category: Category.MOVIE,
  };

  const mockUser = {
    _id: '61c0ccf11d7bf83d153d7c06',
    fullName: 'User Name',
    email: 'user@example.com',
    roles: ['ADMIN'],
  };

  const mockMoviesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    moviesController = module.get<MoviesController>(MoviesController);
    moviesService = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(moviesController).toBeDefined();
  });

  describe('create', () => {
    it('should create a new movie', async () => {
      mockMoviesService.create.mockResolvedValueOnce(mockMovie);

      const createMovieDto: CreateMovieDto = {
        name: 'New Movie',
        director: 'Director',
        detail: 'Movie Description',
        release_year: 2023,
        characters: ['Character 1', 'Character 2'],
        category: Category.MOVIE,
      };

      const result = await moviesController.create(createMovieDto, mockUser as User);

      expect(mockMoviesService.create).toHaveBeenCalledWith(createMovieDto, mockUser);
      expect(result).toEqual(mockMovie);
    });

    it('should not create a movie for non-admin user', async () => {
      const nonAdminUser = {
        _id: 'anotherUserId',
        fullName: 'Non-Admin User',
        email: 'nonadmin@example.com',
        roles: ['PERSON'],
      };

      mockMoviesService.create.mockRejectedValueOnce(new UnauthorizedException('Unauthorized'));

      try {
        await moviesController.create(mockMovie as Movie, nonAdminUser as User);
        fail('Expected an exception to be thrown');
      } catch (error) {
        expect(error.message).toBe('Unauthorized');
      }

      expect(mockMoviesService.create).toHaveBeenCalledWith(mockMovie, nonAdminUser);
    });
  });
  describe('findAll', () => {
    it('should return a list of movies', async () => {
      const paginationDto = {
        limit: 5,
        offset: 1,
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
  
      const totalElements = mockMovies.length;
  
      mockMoviesService.findAll.mockResolvedValueOnce({
        movies: mockMovies,
        totalElements,
        maxpages: 1, 
        currentpage: 1
      });
  
      const result = await moviesController.findAll(paginationDto);
  
      expect(mockMoviesService.findAll).toHaveBeenCalledWith(paginationDto);
      expect(result).toEqual({ movies: mockMovies, totalElements, maxpages: 1, currentpage: 1 });
    });

  });
  describe('findOne', () => {
    
    it('should find and return a movie by ID', async () => {

      mockMoviesService.findOne.mockResolvedValue(mockMovie);

      const result = await moviesController.findOne(mockMovie._id);

      expect(mockMoviesService.findOne).toHaveBeenCalledWith(mockMovie._id);
      expect(result).toEqual(mockMovie);
    });

    it('should throw NotFoundException if movie is not found', async () => {

      mockMoviesService.findOne.mockRejectedValue(new NotFoundException());

      await expect(moviesController.findOne(mockMovie._id)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockMoviesService.findOne).toHaveBeenCalledWith(mockMovie._id);
    });
  });
  describe('update', () => {
    it('should update and return a movie', async () => {
      const updatedMovie = { ...mockMovie, name: 'Updated name' };
      const movie = { name: 'Updated title' };

      mockMoviesService.update = jest.fn().mockResolvedValueOnce(updatedMovie);

      const result = await moviesController.update(
        mockMovie._id,
        movie as UpdateMovieDto,
      );
      expect(moviesService.update).toHaveBeenCalled();
      expect(result).toEqual(updatedMovie);
    });
  });
  describe('deleteMovie', () => {
    it('should delete a movie by ID', async () => {
      mockMoviesService.remove.mockResolvedValue("the movie was removed");
      const result = await moviesController.remove(mockMovie._id);

      expect(moviesService.remove).toHaveBeenCalled();
      expect(result).toEqual("the movie was removed");
    });
  });
});
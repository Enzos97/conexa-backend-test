import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  let authMok = {
    "user": {
        "fullName": "enzo sanchez",
        "email": "enz997.ing.ind@gmail.com",
        "password": "$2b$10$3ID0PyXfCD3rP/tUg7qUb.pqj/pUihvOaL6S2Ym4DrbMm/5qZcJEi",
        "isActive": true,
        "roles": [
            "PERSON"
        ],
        "_id": "65133262500fe17d37e9371f",
        "createdAt": "2023-09-26T19:34:58.671Z",
        "updatedAt": "2023-09-26T19:34:58.671Z",
        "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MTMzMjYyNTAwZmUxN2QzN2U5MzcxZiIsImlhdCI6MTY5NTc1NjkwMSwiZXhwIjoxNjk1NzY0MTAxfQ.Nzg4h-b78B_JdM1SmoY4gfEfjvyQxJ3xflgcraQT79I"
  };


  const mockAuthService = {
    create: jest.fn().mockResolvedValueOnce(authMok),
    login: jest.fn().mockResolvedValueOnce(authMok),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });
  
  describe('signUp', () => {
    it('should register a new user', async () => {
      const createAuthDto = {
        fullName: 'user new',
        email: 'user2023@gmail.com',
        password: 'User123',
      };

      const result = await authController.create(createAuthDto);
      expect(authService.create).toHaveBeenCalled();
      expect(result).toEqual(authMok);
    });
  });

  describe('login', () => {
    it('should login user', async () => {
      const LoginUserDto = {
        email: 'user2023@gmail.com',
        password: 'User123',
      };

      const result = await authController.login(LoginUserDto);
      expect(authService.login).toHaveBeenCalled();
      expect(result).toEqual(authMok);
    });
  });

});


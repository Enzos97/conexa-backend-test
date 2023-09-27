import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth.service';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../../emails/emails.service';
import { CommonService } from '../../common/common.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userModel: Model<User>;

  const mockUserModel = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockEmailService = {
    send_register_mail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommonService,
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createAuthDto = {
        fullName: 'User Mock',
        email: 'usermock@example.com',
        password: 'Password123',
      };

      const hashedPassword = bcrypt.hashSync(createAuthDto.password, 10);

      mockUserModel.create.mockResolvedValueOnce({
        _id: 'user-id',
        ...createAuthDto,
        password: hashedPassword,
      });
      
      mockJwtService.sign.mockReturnValueOnce('jwt-token');
      
      const result = await authService.create(createAuthDto);

      expect(mockUserModel.create).toHaveBeenCalledWith({
        ...createAuthDto,
        password: expect.stringMatching(/^\$2b\$10\$.+/),
      });

      expect(result).toEqual({
        user: {
          _id: 'user-id',
          ...createAuthDto,
          password: hashedPassword,
        },
        token: expect.any(String),
      });
    });
  });

  describe('login', () => {
    it('should log in a user', async () => {
      const loginUserDto = {
        email: 'usermock@example.com',
        password: 'Password123',
      };

      const hashedPassword = bcrypt.hashSync(loginUserDto.password, 10);

      const mockUser = {
        _id: 'user-id',
        email: loginUserDto.email,
        password: hashedPassword,
      };

      mockUserModel.findOne.mockResolvedValueOnce(mockUser);

      mockJwtService.sign.mockReturnValueOnce('jwt-token');

      const result = await authService.login(loginUserDto);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: loginUserDto.email,
      });

      expect(result).toEqual({
        user: mockUser,
        token: 'jwt-token',
      });
    });
  });
});

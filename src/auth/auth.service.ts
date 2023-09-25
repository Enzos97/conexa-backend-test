import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { CommonService } from 'src/common/common.service';
import * as bcrypt from 'bcrypt'
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly commonService: CommonService,
    private readonly jwtService: JwtService,
  ){}

  async create(createAuthDto: CreateAuthDto) {
    try {
      const {password, ...userData} = createAuthDto
      const newUser = await this.userModel.create({
        userData,
        password: bcrypt.hashSync(password, 10)
      })
      return {
        user: newUser,
        token: this.getJwtToken({id :newUser.id})
      }
    } catch (error) {
      this.commonService.handleExceptions(error)
    }
  }

  async login(loginUserDto:LoginUserDto){
    try {
      const {email, password} = loginUserDto
      const user = await this.userModel.findOne({email})
      if(!user){
        throw new UnauthorizedException('email or password is invalid')
      }
      if(!bcrypt.compareSync(password,user.password)){
        throw new UnauthorizedException('email or password is invalid')
      }
      return {
        user,
        token: this.getJwtToken({id :user.id})
      }
    } catch (error) {
      this.commonService.handleExceptions(error)
    }
  }

  private getJwtToken( payload:JwtPayload){
    const token = this.jwtService.sign(payload);
    return token
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}

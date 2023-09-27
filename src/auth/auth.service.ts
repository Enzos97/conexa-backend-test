import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { CommonService } from '../common/common.service';
import * as bcrypt from 'bcrypt'
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../emails/emails.service';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly commonService: CommonService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ){}

  async create(createAuthDto: CreateAuthDto) {
    try {
      const {password, ...userData} = createAuthDto

      const newUser = await this.userModel.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      })
      await this.emailService.send_register_mail({user: newUser.email,name: newUser.fullName})
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

}

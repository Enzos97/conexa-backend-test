import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';

@Injectable()
export class CommonService {

  handleExceptions(error: any): never {

    if (error.code === 11000) {
      throw new BadRequestException({
        statusCode:409,
        message: `${'An entity'} with that ${
          Object.keys(error.keyPattern)[0]
        } already exists in the database ${JSON.stringify(error.keyValue)}`,
        error:"Duplicated key"
      });
    }
    if (error.name === 'BadRequestException'|| error.name === 'MongoServerError'){
      throw new BadRequestException(error.message);
    }
    if (error.name === 'InternalServerErrorException'){
      throw new InternalServerErrorException(error.message);
    }
    if (error.name === 'NotFoundException'){
      throw new NotFoundException(error.message);
    }
    if (error.name === 'UnauthorizedException'){
      throw new UnauthorizedException(error.message);
    }
    else{
      throw new InternalServerErrorException(
        `Something went wrong. ${error.message}`,
        );
    }
    
  }

}

import { Injectable } from '@nestjs/common';
import axios, {AxiosInstance} from 'axios';
import { StarWarsResponse } from './interfaces/starwars-api-res.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Movie } from 'src/movies/entities/movie.entity';
import { Model } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';
import { Role } from 'src/auth/types/role.type';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Movie.name)
    private readonly movieModel: Model<Movie>,
    @InjectModel(User.name)
    private readonly UserModel: Model<User>
  ){}
  private readonly axios: AxiosInstance= axios;
  async seedAdmin(){
    await this.UserModel.deleteMany({})

    const admin = await this.UserModel.create({
      fullName:"admin prueba local",
      email:"admin@local.com",
      password:bcrypt.hashSync("Admin123", 10),
      isActive:true,
      roles:[Role.admin]
    })

    return {message:"admin created", credential:{email:admin.email,password:"Admin123"}}
  }
  
  async seedMoviesExecute() {
    await this.movieModel.deleteMany({})

    const response = await this.axios.get<StarWarsResponse>('https://swapi.py4e.com/api/films/')

    const insertMoviesPromises: Promise<Movie>[] = []

    response.data.results.forEach(async({title,director,release_date,opening_crawl,characters})=>{
      const release = release_date.split('-');
      const release_year = +release[0]
      
      const characters_res = characters.map(async m=> await this.axios.get(m))
      const characters_name =await Promise.all(characters_res)
      const character = characters_name.map(m=>m.data.name.toLowerCase())
      const detailText = opening_crawl.replace(/[\r\n]+/g, ' ') 

      insertMoviesPromises.push(
        this.movieModel.create({
            name: `star wars: ${title}`,
            director: director,
            release_year: release_year,
            detail:detailText,
            characters: character
          })
      )

    })

    await Promise.all(insertMoviesPromises)

    return 'Seed Executed';
  }

}

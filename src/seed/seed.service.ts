import { Injectable } from '@nestjs/common';
import axios, {AxiosInstance} from 'axios';
import { StarWarsResponse } from './interfaces/starwars-api-res.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Movie } from 'src/movies/entities/movie.entity';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Movie.name)
    private readonly movieModel: Model<Movie>,
  ){}
  private readonly axios: AxiosInstance= axios;
  
  async seedExecute() {
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

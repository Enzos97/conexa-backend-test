import { Injectable } from '@nestjs/common';
import axios, {AxiosInstance} from 'axios';
import { StarWarsResponse } from './interfaces/starwar-api-res.interface';

@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance= axios;
  
  async seedExecute() {
    const response = await this.axios.get<StarWarsResponse>('https://swapi.py4e.com/api/films/')

    response.data.results.forEach(({title,director,release_date,characters})=>{
      const release = release_date.split('-');
      const release_year = +release[0]
      console.log(title,director,release_date,release_year,characters)
    })

    return response.data;
  }

}

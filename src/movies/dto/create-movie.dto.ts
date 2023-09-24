import { IsString, MinLength, MaxLength, IsInt, IsPositive, IsOptional, IsArray } from "class-validator";

export class CreateMovieDto {
    @IsString()
    @MinLength(1)
    @MaxLength(250)
    name:string;
    @IsString()
    @MinLength(1)
    @MaxLength(250)
    director:string;
    @IsString()
    @MinLength(1)
    @IsOptional()
    detail:string;
    @IsInt()
    @IsPositive()
    release_year:number;
    @IsString({ each: true }) 
    @IsArray()
    @IsOptional()
    characters:string[]
}

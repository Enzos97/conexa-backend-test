import { IsEmail, IsOptional, IsString } from "class-validator";

export class PruebaDto{
    @IsOptional()
    @IsString()
    @IsEmail()
    user:string

    @IsOptional()
    @IsString()
    name:string
}
import { Document, SchemaTypes, Types } from "mongoose";
import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose"
import { User } from "src/auth/entities/user.entity";
@Schema({
    timestamps: true,
  })
export class Movie extends Document {
    @Prop({
        unique:true,
        required:true,
        set: (val: string) => val.toLowerCase().trim(), get: (val: string) => val
    })
    name: string;
    @Prop({
        default:"no detail"
    })
    detail: string;
    @Prop({
        required:true
    })
    director: string;
    @Prop({
        required:true
    })
    release_year: number; 
    @Prop()
    characters:string[]
    @Prop({
        type: SchemaTypes.ObjectId,
        ref: User.name,
        index: true,
        required: true,
    })
    creator: Types.ObjectId;
}

export const MovieSchema = SchemaFactory.createForClass(Movie)
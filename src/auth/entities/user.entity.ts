import { Document } from "mongoose";
import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose"
import { Role } from "../types/role.type";

@Schema({
    timestamps: true,
  })
export class User extends Document {
    @Prop({
        required:true,
        set: (val: string) => val.toLowerCase().trim(), get: (val: string) => val
    })
    fullName:string;
    @Prop({
        unique:true,
        required:true,
        set: (val: string) => val.toLowerCase().trim(), get: (val: string) => val
    })
    email:string;
    @Prop({
        required:true,
        set: (val: string) => val.trim(), get: (val: string) => val
    })
    password:string;
    @Prop({
        default:true
    })
    isActive:Boolean;
    @Prop({
        default:Role.person
    })
    roles:string[]
}

export const UserSchema = SchemaFactory.createForClass(User)

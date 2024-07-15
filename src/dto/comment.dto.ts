import { IsString, IsNotEmpty,IsEnum } from 'class-validator'
import {Status}from '../constant/enum'
export class CommentDTO {
 

    @IsNotEmpty()
    @IsString()
    comment:string

  
  
}

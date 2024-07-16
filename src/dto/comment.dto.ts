import { IsString, IsNotEmpty,IsEnum, IsEmpty, IsOptional } from 'class-validator'
export class CommentDTO {
 

    @IsNotEmpty()
    @IsString()
    comment:string


    @IsOptional()
    parentId?:string;
  
  
}

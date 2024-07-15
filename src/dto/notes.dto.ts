import { IsString, IsNotEmpty } from 'class-validator'
export class NotesDTO {

 
  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  content: string

  
  
}
export class UpdateNotesDTO extends NotesDTO{

}

import { IsString, IsNotEmpty,IsEnum } from 'class-validator'
import {Status}from '../constant/enum'
export class FriendDTO {
 

    @IsNotEmpty()
    @IsEnum(Status, { message: 'Invalid role' })
    status: Status

  
  
}

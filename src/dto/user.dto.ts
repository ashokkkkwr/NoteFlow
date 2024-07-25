import {
  IsArray,
  //values must be defined. should not be `undefined`
  IsDefined,
  //ensures that the value is a valid email address.
  IsEmail,
  //ensures that the value is not empty
  IsNotEmpty,
  //marks the property as optional.
  //eg middleName?:string, yesto huna paro
  IsOptional,
  //ensures that the value is a string
  IsString,
  //ensures that the value is a valid UUID(Universally Unique Identifer)
  IsUUID,
  //ensures the value matches a given regular expression pattern.
  //eg:@matches(/#&(#EDKFS))
  Matches,
  // Ensures that the value is not equals to specified value.
  NotEquals,
  ValidateNested,
  IsEnum,
  isEmail,
} from 'class-validator'
import { Role } from '../constant/enum'
export class UserDetailsDTO {
  @IsString()
  first_name: string

  @IsOptional()
  middle_name: string

  @IsNotEmpty()
  @IsDefined()
  last_name: string

  @IsNotEmpty()
  @IsDefined()
  phone_number: string

  @IsNotEmpty()
  @IsDefined()
  type:string
}

export class UserDTO extends UserDetailsDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string

  @IsNotEmpty()
  @IsEnum(Role, { message: 'Invalid role' })
  role: Role

}

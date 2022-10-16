import { IsEmail, IsString } from "class-validator"

export class UserRegisterDto {
  @IsEmail({}, { message: "Incorrect email" })
  email: string

  @IsString({ message: "Incorrect input" })
  password: string

  @IsString({ message: "Incorrect input" })
  name: string
}

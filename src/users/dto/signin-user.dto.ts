import { IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SigninUserDto {
  @ApiProperty({
    example: "user@example.com",
    description: "Foydalanuvchi email manzili",
  })
  @IsEmail()
  email: string;
}

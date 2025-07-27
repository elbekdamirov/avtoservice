import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  Length,
  IsEnum,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "generated/prisma";

export class CreateUserDto {
  @ApiProperty({ example: "Elbek Damirov", description: "To‘liq ism familiya" })
  @IsString()
  @Length(3, 50)
  full_name: string;

  @ApiProperty({
    example: "+998901234567",
    description: "Telefon raqam (E.164 formatda)",
  })
  @IsString()
  @Matches(/^\+998\d{9}$/)
  phone: string;

  @ApiProperty({
    example: "user@example.com",
    description: "Foydalanuvchi email manzili",
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    enum: Role,
    description: "Foydalanuvchi roli (optional)",
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

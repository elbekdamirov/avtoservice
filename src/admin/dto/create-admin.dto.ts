import { IsString, IsEmail, Matches, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAdminDto {
  @ApiProperty({
    example: "Elbek Damirov",
    description: "To'liq ism familiyasi",
  })
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
    example: "admin@example.com",
    description: "Email manzil",
  })
  @IsEmail()
  email: string;
}

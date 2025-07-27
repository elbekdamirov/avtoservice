import { Role } from "generated/prisma";

export class CreateUserDto {
  full_name: string;
  phone: string;
  email: string;
  role?: Role;
}

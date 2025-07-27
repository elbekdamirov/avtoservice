import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prismaService.users.create({
      data: createUserDto,
    });
  }

  findAll() {
    return this.prismaService.users.findMany();
  }

  findOne(id: number) {
    return this.prismaService.users.findUnique({ where: { id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prismaService.users.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prismaService.users.delete({ where: { id } });
  }
}

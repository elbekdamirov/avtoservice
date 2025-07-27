import { Injectable } from "@nestjs/common";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AdminService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createAdminDto: CreateAdminDto) {
    return this.prismaService.admins.create({ data: createAdminDto });
  }

  findAll() {
    return this.prismaService.admins.findMany();
  }

  findOne(id: number) {
    return this.prismaService.admins.findUnique({ where: { id } });
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return this.prismaService.admins.update({
      where: { id },
      data: updateAdminDto,
    });
  }

  remove(id: number) {
    return this.prismaService.admins.delete({ where: { id } });
  }
}

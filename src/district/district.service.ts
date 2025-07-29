import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateDistrictDto } from "./dto/create-district.dto";
import { UpdateDistrictDto } from "./dto/update-district.dto";

@Injectable()
export class DistrictsService {
  constructor(private prisma: PrismaService) {}

  async create(createDistrictDto: CreateDistrictDto) {
    return await this.prisma.district.create({
      data: createDistrictDto,
    });
  }

  async findAll() {
    return await this.prisma.district.findMany({
      include: {
        Regions: true,
      },
    });
  }

  async findOne(id: number) {
    const district = await this.prisma.district.findUnique({
      where: { id },
      include: { Regions: true },
    });

    if (!district)
      throw new NotFoundException(`District with id ${id} not found`);
    return district;
  }

  async update(id: number, updateDistrictDto: UpdateDistrictDto) {
    const district = await this.prisma.district.findUnique({ where: { id } });
    if (!district)
      throw new NotFoundException(`District with id ${id} not found`);

    return await this.prisma.district.update({
      where: { id },
      data: updateDistrictDto,
    });
  }

  async remove(id: number) {
    const district = await this.prisma.district.findUnique({ where: { id } });
    if (!district)
      throw new NotFoundException(`District with id ${id} not found`);

    return await this.prisma.district.delete({ where: { id } });
  }
}

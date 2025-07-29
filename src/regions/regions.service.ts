import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateRegionDto } from "./dto/create-region.dto";
import { UpdateRegionDto } from "./dto/update-region.dto";

@Injectable()
export class RegionsService {
  constructor(private prisma: PrismaService) {}

  async create(createRegionDto: CreateRegionDto) {
    return await this.prisma.regions.create({
      data: createRegionDto,
    });
  }

  async findAll() {
    return await this.prisma.regions.findMany();
  }

  async findOne(id: number) {
    const region = await this.prisma.regions.findUnique({ where: { id } });
    if (!region) throw new NotFoundException(`Region with id ${id} not found`);
    return region;
  }

  async update(id: number, updateRegionDto: UpdateRegionDto) {
    const region = await this.prisma.regions.findUnique({ where: { id } });
    if (!region) throw new NotFoundException(`Region with id ${id} not found`);

    return await this.prisma.regions.update({
      where: { id },
      data: updateRegionDto,
    });
  }

  async remove(id: number) {
    const region = await this.prisma.regions.findUnique({ where: { id } });
    if (!region) throw new NotFoundException(`Region with id ${id} not found`);

    return await this.prisma.regions.delete({ where: { id } });
  }
}

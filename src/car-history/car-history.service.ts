import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCarHistoryDto } from "./dto/create-car-history.dto";
import { UpdateCarHistoryDto } from "./dto/update-car-history.dto";

@Injectable()
export class CarHistoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCarHistoryDto: CreateCarHistoryDto) {
    return await this.prisma.carHistory.create({
      data: createCarHistoryDto,
    });
  }

  async findAll() {
    return await this.prisma.carHistory.findMany({
      include: {
        Car: true,
        Users: true,
      },
    });
  }

  async findOne(id: number) {
    const history = await this.prisma.carHistory.findUnique({
      where: { id },
      include: {
        Car: true,
        Users: true,
      },
    });

    if (!history)
      throw new NotFoundException(`CarHistory with id ${id} not found`);
    return history;
  }

  async update(id: number, updateCarHistoryDto: UpdateCarHistoryDto) {
    const exists = await this.prisma.carHistory.findUnique({ where: { id } });
    if (!exists)
      throw new NotFoundException(`CarHistory with id ${id} not found`);

    return await this.prisma.carHistory.update({
      where: { id },
      data: updateCarHistoryDto,
    });
  }

  async remove(id: number) {
    const exists = await this.prisma.carHistory.findUnique({ where: { id } });
    if (!exists)
      throw new NotFoundException(`CarHistory with id ${id} not found`);

    return await this.prisma.carHistory.delete({
      where: { id },
    });
  }
}

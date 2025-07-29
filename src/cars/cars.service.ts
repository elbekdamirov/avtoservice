import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCarDto } from "./dto/create-car.dto";
import { UpdateCarDto } from "./dto/update-car.dto";

@Injectable()
export class CarsService {
  constructor(private prisma: PrismaService) {}

  create(createCarDto: CreateCarDto) {
    return this.prisma.car.create({
      data: createCarDto,
    });
  }

  async findAll() {
    return await this.prisma.car.findMany();
  }

  async findOne(id: number) {
    const car = await this.prisma.car.findUnique({ where: { id } });
    if (!car) throw new NotFoundException(`Car with id ${id} not found`);
    return car;
  }

  async update(id: number, updateCarDto: UpdateCarDto) {
    const existingCar = await this.prisma.car.findUnique({ where: { id } });
    if (!existingCar)
      throw new NotFoundException(`Car with id ${id} not found`);

    return await this.prisma.car.update({
      where: { id },
      data: updateCarDto,
    });
  }

  async remove(id: number) {
    const existingCar = await this.prisma.car.findUnique({ where: { id } });
    if (!existingCar)
      throw new NotFoundException(`Car with id ${id} not found`);

    return await this.prisma.car.delete({
      where: { id },
    });
  }
}

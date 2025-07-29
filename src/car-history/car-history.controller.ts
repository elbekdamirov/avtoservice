import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CarHistoryService } from './car-history.service';
import { CreateCarHistoryDto } from './dto/create-car-history.dto';
import { UpdateCarHistoryDto } from './dto/update-car-history.dto';

@Controller('car-history')
export class CarHistoryController {
  constructor(private readonly carHistoryService: CarHistoryService) {}

  @Post()
  create(@Body() createCarHistoryDto: CreateCarHistoryDto) {
    return this.carHistoryService.create(createCarHistoryDto);
  }

  @Get()
  findAll() {
    return this.carHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCarHistoryDto: UpdateCarHistoryDto) {
    return this.carHistoryService.update(+id, updateCarHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carHistoryService.remove(+id);
  }
}

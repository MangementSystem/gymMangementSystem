import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post()
  create(@Body() createProgressDto: CreateProgressDto) {
    return this.progressService.create(createProgressDto);
  }

  @Get()
  findAll(
    @Query('memberId') memberId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.progressService.findAll(
      memberId ? +memberId : undefined,
      startDate,
      endDate,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.progressService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProgressDto: UpdateProgressDto,
  ) {
    return this.progressService.update(+id, updateProgressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.progressService.remove(+id);
  }
}

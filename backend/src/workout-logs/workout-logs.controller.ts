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
import { WorkoutLogsService } from './workout-logs.service';
import { CreateWorkoutLogDto } from './dto/create-workout-log.dto';
import { UpdateWorkoutLogDto } from './dto/update-workout-log.dto';

@Controller('workout-logs')
export class WorkoutLogsController {
  constructor(private readonly workoutLogsService: WorkoutLogsService) {}

  @Post()
  create(@Body() createWorkoutLogDto: CreateWorkoutLogDto) {
    return this.workoutLogsService.create(createWorkoutLogDto);
  }

  @Get()
  findAll(
    @Query('memberId') memberId?: string,
    @Query('programId') programId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.workoutLogsService.findAll(
      memberId ? +memberId : undefined,
      programId ? +programId : undefined,
      startDate,
      endDate,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workoutLogsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWorkoutLogDto: UpdateWorkoutLogDto,
  ) {
    return this.workoutLogsService.update(+id, updateWorkoutLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workoutLogsService.remove(+id);
  }
}

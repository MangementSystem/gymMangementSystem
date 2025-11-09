import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkoutLogSetsService } from './workout-log-sets.service';
import { CreateWorkoutLogSetDto } from './dto/create-workout-log-set.dto';
import { UpdateWorkoutLogSetDto } from './dto/update-workout-log-set.dto';

@Controller('workout-log-sets')
export class WorkoutLogSetsController {
  constructor(private readonly workoutLogSetsService: WorkoutLogSetsService) {}

  @Post()
  create(@Body() createWorkoutLogSetDto: CreateWorkoutLogSetDto) {
    return this.workoutLogSetsService.create(createWorkoutLogSetDto);
  }

  @Get()
  findAll() {
    return this.workoutLogSetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workoutLogSetsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkoutLogSetDto: UpdateWorkoutLogSetDto) {
    return this.workoutLogSetsService.update(+id, updateWorkoutLogSetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workoutLogSetsService.remove(+id);
  }
}

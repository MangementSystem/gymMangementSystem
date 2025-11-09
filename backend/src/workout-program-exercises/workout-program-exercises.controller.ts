import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkoutProgramExercisesService } from './workout-program-exercises.service';
import { CreateWorkoutProgramExerciseDto } from './dto/create-workout-program-exercise.dto';
import { UpdateWorkoutProgramExerciseDto } from './dto/update-workout-program-exercise.dto';

@Controller('workout-program-exercises')
export class WorkoutProgramExercisesController {
  constructor(private readonly workoutProgramExercisesService: WorkoutProgramExercisesService) {}

  @Post()
  create(@Body() createWorkoutProgramExerciseDto: CreateWorkoutProgramExerciseDto) {
    return this.workoutProgramExercisesService.create(createWorkoutProgramExerciseDto);
  }

  @Get()
  findAll() {
    return this.workoutProgramExercisesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workoutProgramExercisesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkoutProgramExerciseDto: UpdateWorkoutProgramExerciseDto) {
    return this.workoutProgramExercisesService.update(+id, updateWorkoutProgramExerciseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workoutProgramExercisesService.remove(+id);
  }
}

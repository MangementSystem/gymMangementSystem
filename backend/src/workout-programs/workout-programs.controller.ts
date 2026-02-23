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
import { WorkoutProgramsService } from './workout-programs.service';
import { CreateWorkoutProgramDto } from './dto/create-workout-program.dto';
import { UpdateWorkoutProgramDto } from './dto/update-workout-program.dto';

@Controller('workout-programs')
export class WorkoutProgramsController {
  constructor(
    private readonly workoutProgramsService: WorkoutProgramsService,
  ) {}

  @Post()
  create(@Body() createWorkoutProgramDto: CreateWorkoutProgramDto) {
    return this.workoutProgramsService.create(createWorkoutProgramDto);
  }

  @Get()
  findAll(@Query('memberId') memberId?: string) {
    return this.workoutProgramsService.findAll(
      memberId ? +memberId : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workoutProgramsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWorkoutProgramDto: UpdateWorkoutProgramDto,
  ) {
    return this.workoutProgramsService.update(+id, updateWorkoutProgramDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workoutProgramsService.remove(+id);
  }
}

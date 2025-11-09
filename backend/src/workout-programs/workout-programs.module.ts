import { Module } from '@nestjs/common';
import { WorkoutProgramsService } from './workout-programs.service';
import { WorkoutProgramsController } from './workout-programs.controller';

@Module({
  controllers: [WorkoutProgramsController],
  providers: [WorkoutProgramsService],
})
export class WorkoutProgramsModule {}

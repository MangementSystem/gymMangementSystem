import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutProgramsService } from './workout-programs.service';
import { WorkoutProgramsController } from './workout-programs.controller';
import { WorkoutProgram } from './entities/workout-program.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkoutProgram])],
  controllers: [WorkoutProgramsController],
  providers: [WorkoutProgramsService],
  exports: [WorkoutProgramsService],
})
export class WorkoutProgramsModule {}

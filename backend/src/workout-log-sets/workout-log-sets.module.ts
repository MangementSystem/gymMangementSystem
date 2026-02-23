import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutLogSetsService } from './workout-log-sets.service';
import { WorkoutLogSetsController } from './workout-log-sets.controller';
import { WorkoutLogSet } from './entities/workout-log-set.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkoutLogSet])],
  controllers: [WorkoutLogSetsController],
  providers: [WorkoutLogSetsService],
  exports: [WorkoutLogSetsService],
})
export class WorkoutLogSetsModule {}

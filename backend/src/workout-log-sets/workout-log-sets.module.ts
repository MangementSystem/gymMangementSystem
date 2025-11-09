import { Module } from '@nestjs/common';
import { WorkoutLogSetsService } from './workout-log-sets.service';
import { WorkoutLogSetsController } from './workout-log-sets.controller';

@Module({
  controllers: [WorkoutLogSetsController],
  providers: [WorkoutLogSetsService],
})
export class WorkoutLogSetsModule {}

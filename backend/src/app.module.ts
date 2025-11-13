import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationsModule } from './organizations/organizations.module';
import { MembersModule } from './members/members.module';
import { PlansModule } from './plans/plans.module';
import { MembershipsModule } from './memberships/memberships.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AttendanceDevicesModule } from './attendance-devices/attendance-devices.module';
import { AttendanceLogsModule } from './attendance-logs/attendance-logs.module';
import { ProgressModule } from './progress/progress.module';
import { ExercisesModule } from './exercises/exercises.module';
import { WorkoutProgramsModule } from './workout-programs/workout-programs.module';
import { WorkoutProgramExercisesModule } from './workout-program-exercises/workout-program-exercises.module';
import { WorkoutLogsModule } from './workout-logs/workout-logs.module';
import { WorkoutLogSetsModule } from './workout-log-sets/workout-log-sets.module';
import { AiExerciseAnalysisModule } from './ai-exercise-analysis/ai-exercise-analysis.module';
import { AiInsightsModule } from './ai-insights/ai-insights.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [OrganizationsModule, MembersModule, PlansModule, MembershipsModule, TransactionsModule, AttendanceDevicesModule, AttendanceLogsModule, ProgressModule, ExercisesModule, WorkoutProgramsModule, WorkoutProgramExercisesModule, WorkoutLogsModule, WorkoutLogSetsModule, AiExerciseAnalysisModule, AiInsightsModule,TypeOrmModule.forRoot({
    type: 'postgres',
      url:'postgresql://neondb_owner:npg_RDXSMap62Cyr@ep-green-fire-adbswa69-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
      autoLoadEntities: true,
      entities: [__dirname + '/entities/*.entity.{ts,js}'],
      synchronize: true,
      logging: true,
  })],
  controllers: [AppController],
  providers: [AppService], 
})
export class AppModule {}

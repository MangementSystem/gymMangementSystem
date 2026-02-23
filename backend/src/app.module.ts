import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
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
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url:
        process.env.DATABASE_URL ||
        'postgresql://localhost:5432/gym_management',
      autoLoadEntities: true,
      entities: [__dirname + '/**/*.entity.{ts,js}'],
      synchronize: false,
      logging: false,
    }),
    AuthModule,
    OrganizationsModule,
    MembersModule,
    PlansModule,
    MembershipsModule,
    TransactionsModule,
    AttendanceDevicesModule,
    AttendanceLogsModule,
    ProgressModule,
    ExercisesModule,
    WorkoutProgramsModule,
    WorkoutProgramExercisesModule,
    WorkoutLogsModule,
    WorkoutLogSetsModule,
    AiExerciseAnalysisModule,
    AiInsightsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceLogsService } from './attendance-logs.service';
import { AttendanceLogsController } from './attendance-logs.controller';
import { AttendanceLog } from './entities/attendance-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceLog])],
  controllers: [AttendanceLogsController],
  providers: [AttendanceLogsService],
  exports: [AttendanceLogsService],
})
export class AttendanceLogsModule {}

import { Module } from '@nestjs/common';
import { AttendanceLogsService } from './attendance-logs.service';
import { AttendanceLogsController } from './attendance-logs.controller';

@Module({
  controllers: [AttendanceLogsController],
  providers: [AttendanceLogsService],
})
export class AttendanceLogsModule {}

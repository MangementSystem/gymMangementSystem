import { Module } from '@nestjs/common';
import { AttendanceDevicesService } from './attendance-devices.service';
import { AttendanceDevicesController } from './attendance-devices.controller';

@Module({
  controllers: [AttendanceDevicesController],
  providers: [AttendanceDevicesService],
})
export class AttendanceDevicesModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceDevicesService } from './attendance-devices.service';
import { AttendanceDevicesController } from './attendance-devices.controller';
import { AttendanceDevice } from './entities/attendance-device.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceDevice])],
  controllers: [AttendanceDevicesController],
  providers: [AttendanceDevicesService],
  exports: [AttendanceDevicesService],
})
export class AttendanceDevicesModule {}

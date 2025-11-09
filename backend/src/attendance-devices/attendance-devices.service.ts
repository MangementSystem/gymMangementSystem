import { Injectable } from '@nestjs/common';
import { CreateAttendanceDeviceDto } from './dto/create-attendance-device.dto';
import { UpdateAttendanceDeviceDto } from './dto/update-attendance-device.dto';

@Injectable()
export class AttendanceDevicesService {
  create(createAttendanceDeviceDto: CreateAttendanceDeviceDto) {
    return 'This action adds a new attendanceDevice';
  }

  findAll() {
    return `This action returns all attendanceDevices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attendanceDevice`;
  }

  update(id: number, updateAttendanceDeviceDto: UpdateAttendanceDeviceDto) {
    return `This action updates a #${id} attendanceDevice`;
  }

  remove(id: number) {
    return `This action removes a #${id} attendanceDevice`;
  }
}

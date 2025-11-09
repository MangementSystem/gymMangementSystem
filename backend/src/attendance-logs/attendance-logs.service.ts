import { Injectable } from '@nestjs/common';
import { CreateAttendanceLogDto } from './dto/create-attendance-log.dto';
import { UpdateAttendanceLogDto } from './dto/update-attendance-log.dto';

@Injectable()
export class AttendanceLogsService {
  create(createAttendanceLogDto: CreateAttendanceLogDto) {
    return 'This action adds a new attendanceLog';
  }

  findAll() {
    return `This action returns all attendanceLogs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attendanceLog`;
  }

  update(id: number, updateAttendanceLogDto: UpdateAttendanceLogDto) {
    return `This action updates a #${id} attendanceLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} attendanceLog`;
  }
}

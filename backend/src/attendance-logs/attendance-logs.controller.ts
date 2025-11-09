import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AttendanceLogsService } from './attendance-logs.service';
import { CreateAttendanceLogDto } from './dto/create-attendance-log.dto';
import { UpdateAttendanceLogDto } from './dto/update-attendance-log.dto';

@Controller('attendance-logs')
export class AttendanceLogsController {
  constructor(private readonly attendanceLogsService: AttendanceLogsService) {}

  @Post()
  create(@Body() createAttendanceLogDto: CreateAttendanceLogDto) {
    return this.attendanceLogsService.create(createAttendanceLogDto);
  }

  @Get()
  findAll() {
    return this.attendanceLogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendanceLogsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttendanceLogDto: UpdateAttendanceLogDto) {
    return this.attendanceLogsService.update(+id, updateAttendanceLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendanceLogsService.remove(+id);
  }
}

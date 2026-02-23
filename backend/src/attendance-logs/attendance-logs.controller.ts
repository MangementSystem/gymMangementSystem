import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
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
  findAll(
    @Query('organizationId') organizationId?: string,
    @Query('memberId') memberId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceLogsService.findAll(
      organizationId ? +organizationId : undefined,
      memberId ? +memberId : undefined,
      startDate,
      endDate,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendanceLogsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttendanceLogDto: UpdateAttendanceLogDto,
  ) {
    return this.attendanceLogsService.update(+id, updateAttendanceLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendanceLogsService.remove(+id);
  }

  @Post('check-in')
  checkIn(@Body() body: { memberId: number; deviceId?: number }) {
    return this.attendanceLogsService.checkIn(body.memberId, body.deviceId);
  }

  @Post(':id/check-out')
  checkOut(@Param('id') id: string) {
    return this.attendanceLogsService.checkOut(+id);
  }
}

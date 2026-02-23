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
import { AttendanceDevicesService } from './attendance-devices.service';
import { CreateAttendanceDeviceDto } from './dto/create-attendance-device.dto';
import { UpdateAttendanceDeviceDto } from './dto/update-attendance-device.dto';

@Controller('attendance-devices')
export class AttendanceDevicesController {
  constructor(
    private readonly attendanceDevicesService: AttendanceDevicesService,
  ) {}

  @Post()
  create(@Body() createAttendanceDeviceDto: CreateAttendanceDeviceDto) {
    return this.attendanceDevicesService.create(createAttendanceDeviceDto);
  }

  @Get()
  findAll(@Query('organizationId') organizationId?: string) {
    return this.attendanceDevicesService.findAll(
      organizationId ? +organizationId : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendanceDevicesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttendanceDeviceDto: UpdateAttendanceDeviceDto,
  ) {
    return this.attendanceDevicesService.update(+id, updateAttendanceDeviceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendanceDevicesService.remove(+id);
  }
}

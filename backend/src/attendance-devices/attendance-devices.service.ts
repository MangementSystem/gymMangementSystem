import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceDevice } from './entities/attendance-device.entity';
import { CreateAttendanceDeviceDto } from './dto/create-attendance-device.dto';
import { UpdateAttendanceDeviceDto } from './dto/update-attendance-device.dto';

@Injectable()
export class AttendanceDevicesService {
  constructor(
    @InjectRepository(AttendanceDevice)
    private attendanceDeviceRepository: Repository<AttendanceDevice>,
  ) {}

  async create(
    createAttendanceDeviceDto: CreateAttendanceDeviceDto,
  ): Promise<AttendanceDevice> {
    const attendanceDevice = this.attendanceDeviceRepository.create({
      ...createAttendanceDeviceDto,
      organization: createAttendanceDeviceDto.organizationId
        ? { id: createAttendanceDeviceDto.organizationId }
        : undefined,
    });
    return this.attendanceDeviceRepository.save(attendanceDevice);
  }

  async findAll(organizationId?: number): Promise<AttendanceDevice[]> {
    const query = this.attendanceDeviceRepository.createQueryBuilder('device');

    if (organizationId) {
      query.andWhere('device.organization = :organizationId', {
        organizationId,
      });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<AttendanceDevice> {
    const attendanceDevice = await this.attendanceDeviceRepository.findOne({
      where: { id },
      relations: ['organization', 'logs'],
    });
    if (!attendanceDevice) {
      throw new NotFoundException(`Attendance device with ID ${id} not found`);
    }
    return attendanceDevice;
  }

  async update(
    id: number,
    updateAttendanceDeviceDto: UpdateAttendanceDeviceDto,
  ): Promise<AttendanceDevice> {
    const attendanceDevice = await this.findOne(id);
    Object.assign(attendanceDevice, updateAttendanceDeviceDto);
    return this.attendanceDeviceRepository.save(attendanceDevice);
  }

  async remove(id: number): Promise<void> {
    const attendanceDevice = await this.findOne(id);
    await this.attendanceDeviceRepository.remove(attendanceDevice);
  }
}

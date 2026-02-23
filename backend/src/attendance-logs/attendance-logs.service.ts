import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceLog } from './entities/attendance-log.entity';
import { CreateAttendanceLogDto } from './dto/create-attendance-log.dto';
import { UpdateAttendanceLogDto } from './dto/update-attendance-log.dto';

@Injectable()
export class AttendanceLogsService {
  constructor(
    @InjectRepository(AttendanceLog)
    private attendanceLogRepository: Repository<AttendanceLog>,
  ) {}

  async create(
    createAttendanceLogDto: CreateAttendanceLogDto,
  ): Promise<AttendanceLog> {
    const attendanceLog = this.attendanceLogRepository.create({
      ...createAttendanceLogDto,
      member: { id: createAttendanceLogDto.memberId },
      device: createAttendanceLogDto.deviceId
        ? { id: createAttendanceLogDto.deviceId }
        : undefined,
      organization: createAttendanceLogDto.organizationId
        ? { id: createAttendanceLogDto.organizationId }
        : undefined,
    });
    return this.attendanceLogRepository.save(attendanceLog);
  }

  async findAll(
    organizationId?: number,
    memberId?: number,
    startDate?: string,
    endDate?: string,
  ): Promise<AttendanceLog[]> {
    const query = this.attendanceLogRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.member', 'member')
      .leftJoinAndSelect('log.device', 'device');

    if (organizationId) {
      query.andWhere('log.organization = :organizationId', { organizationId });
    }

    if (memberId) {
      query.andWhere('log.member = :memberId', { memberId });
    }

    if (startDate) {
      query.andWhere('log.check_in >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('log.check_in <= :endDate', { endDate });
    }

    return query.orderBy('log.check_in', 'DESC').getMany();
  }

  async findOne(id: number): Promise<AttendanceLog> {
    const attendanceLog = await this.attendanceLogRepository.findOne({
      where: { id },
      relations: ['member', 'device', 'organization'],
    });
    if (!attendanceLog) {
      throw new NotFoundException(`Attendance log with ID ${id} not found`);
    }
    return attendanceLog;
  }

  async update(
    id: number,
    updateAttendanceLogDto: UpdateAttendanceLogDto,
  ): Promise<AttendanceLog> {
    const attendanceLog = await this.findOne(id);
    Object.assign(attendanceLog, updateAttendanceLogDto);
    return this.attendanceLogRepository.save(attendanceLog);
  }

  async remove(id: number): Promise<void> {
    const attendanceLog = await this.findOne(id);
    await this.attendanceLogRepository.remove(attendanceLog);
  }

  async checkIn(memberId: number, deviceId?: number): Promise<AttendanceLog> {
    const attendanceLog = this.attendanceLogRepository.create({
      member: { id: memberId },
      device: deviceId ? { id: deviceId } : undefined,
      check_in: new Date(),
      status: 'checked_in',
    });
    return this.attendanceLogRepository.save(attendanceLog);
  }

  async checkOut(logId: number): Promise<AttendanceLog> {
    const attendanceLog = await this.findOne(logId);
    attendanceLog.check_out = new Date();
    attendanceLog.status = 'checked_out';
    return this.attendanceLogRepository.save(attendanceLog);
  }
}

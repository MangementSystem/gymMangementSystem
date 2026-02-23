import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipsService } from './memberships.service';
import { MembershipsController } from './memberships.controller';
import { Membership } from './entities/membership.entity';
import { Plan } from '../plans/entities/plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Membership, Plan])],
  controllers: [MembershipsController],
  providers: [MembershipsService],
  exports: [MembershipsService],
})
export class MembershipsModule {}

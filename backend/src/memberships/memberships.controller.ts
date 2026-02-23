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
import { MembershipsService } from './memberships.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';

@Controller('memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Post()
  create(@Body() createMembershipDto: CreateMembershipDto) {
    return this.membershipsService.create(createMembershipDto);
  }

  @Get()
  findAll(
    @Query('organizationId') organizationId?: string,
    @Query('memberId') memberId?: string,
    @Query('status') status?: string,
  ) {
    return this.membershipsService.findAll(
      organizationId ? +organizationId : undefined,
      memberId ? +memberId : undefined,
      status,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membershipsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMembershipDto: UpdateMembershipDto,
  ) {
    return this.membershipsService.update(+id, updateMembershipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membershipsService.remove(+id);
  }

  @Post(':id/renew')
  renew(@Param('id') id: string, @Body() body: { planId: number }) {
    return this.membershipsService.renew(+id, body.planId);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.membershipsService.cancel(+id);
  }
}

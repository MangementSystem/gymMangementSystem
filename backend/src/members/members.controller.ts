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
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Public } from '../core/decorators/public.decorator';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Public()
  @Post()
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.membersService.create(createMemberDto);
  }

  @Public()
  @Get()
  findAll(@Query('organizationId') organizationId?: string) {
    return this.membersService.findAll(
      organizationId ? +organizationId : undefined,
    );
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membersService.findOne(+id);
  }

  @Public()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.membersService.update(+id, updateMemberDto);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membersService.remove(+id);
  }

  @Public()
  @Get(':id/stats')
  getMemberStats(@Param('id') id: string) {
    return this.membersService.getMemberStats(+id);
  }
}

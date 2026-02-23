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
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  findAll(
    @Query('organizationId') organizationId?: string,
    @Query('memberId') memberId?: string,
    @Query('type') type?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.transactionsService.findAll(
      organizationId ? +organizationId : undefined,
      memberId ? +memberId : undefined,
      type,
      startDate,
      endDate,
    );
  }

  @Get('reports/financial')
  getFinancialReport(
    @Query('organizationId') organizationId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.transactionsService.getFinancialReport(
      +organizationId,
      startDate,
      endDate,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      organization: { id: createTransactionDto.organizationId },
      membership: createTransactionDto.membershipId
        ? { id: createTransactionDto.membershipId }
        : undefined,
      member: createTransactionDto.memberId
        ? { id: createTransactionDto.memberId }
        : undefined,
    });
    return this.transactionRepository.save(transaction);
  }

  async findAll(
    organizationId?: number,
    memberId?: number,
    type?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<Transaction[]> {
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.member', 'member')
      .leftJoinAndSelect('transaction.membership', 'membership')
      .leftJoinAndSelect('transaction.organization', 'organization');

    if (organizationId) {
      query.andWhere('transaction.organization = :organizationId', {
        organizationId,
      });
    }

    if (memberId) {
      query.andWhere('transaction.member = :memberId', { memberId });
    }

    if (type) {
      query.andWhere('transaction.type = :type', { type });
    }

    if (startDate) {
      query.andWhere('transaction.created_at >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('transaction.created_at <= :endDate', { endDate });
    }

    return query.orderBy('transaction.created_at', 'DESC').getMany();
  }

  async findOne(id: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['member', 'membership', 'organization'],
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  async update(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transaction = await this.findOne(id);
    Object.assign(transaction, updateTransactionDto);
    return this.transactionRepository.save(transaction);
  }

  async remove(id: number): Promise<void> {
    const transaction = await this.findOne(id);
    await this.transactionRepository.remove(transaction);
  }

  async getFinancialReport(
    organizationId: number,
    startDate: string,
    endDate: string,
  ): Promise<any> {
    const transactions = await this.findAll(
      organizationId,
      undefined,
      undefined,
      startDate,
      endDate,
    );

    const isExpenseTransaction = (transaction: Transaction) =>
      transaction.type === 'expense' ||
      transaction.type === 'refund' ||
      transaction.category === 'expense' ||
      Number(transaction.amount) < 0;

    const totalRevenue = transactions
      .filter((transaction) => !isExpenseTransaction(transaction))
      .reduce(
        (sum, transaction) => sum + Math.abs(Number(transaction.amount)),
        0,
      );

    const totalExpenses = transactions
      .filter((transaction) => isExpenseTransaction(transaction))
      .reduce(
        (sum, transaction) => sum + Math.abs(Number(transaction.amount)),
        0,
      );

    return {
      totalRevenue,
      totalExpenses,
      netIncome: totalRevenue - totalExpenses,
      transactionCount: transactions.length,
      period: { startDate, endDate },
    };
  }
}

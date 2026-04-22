import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Transaction } from '../utilities/models/transaction-model';
import { CreateExpenseDto } from '../utilities/dto/create-expense-dto';
import { GetExpensesQueryDto } from 'src/utilities/dto/get-expense-dto';

@Injectable()
export class ExpenseService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async create(dto: CreateExpenseDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Check if this idempotency key has already been processed
      const existing = await queryRunner.manager.findOne(Transaction, {
        where: { idempotencyKey: dto.idempotencyKey },
      });

      if (existing) {
        console.log('exist');
        // Return the existing record instead of creating a new one (Idempotency)
        return existing;
      }

      // Else  Create  new expense with proper type conversion
      const expense = queryRunner.manager.create(Transaction, {
        amount: dto.amount,
        category: dto.category,
        description: dto.description,
        date: new Date(dto.date), // Convert string to Date object
        idempotencyKey: dto.idempotencyKey,
      });
      const savedExpense = await queryRunner.manager.save(expense);

      await queryRunner.commitTransaction();
      return savedExpense;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error('Error creating expense:', err); // Log actual error
      
      if (err.code === '23505') { // Postgres Unique Violation code
        throw new ConflictException('Transaction already processed');
      }
      throw new InternalServerErrorException(`Error saving expense: ${err.message}`);
    } finally {
      await queryRunner.release();
    }
  }
  

  async findAll(queryDto: GetExpensesQueryDto): Promise<Transaction[]> {
    const { category, sort } = queryDto;
    
    // Initialize the query builder
    const query = this.transactionRepository.createQueryBuilder('transaction');

    // 1. Filtering by category
    if (category) {
      query.andWhere('transaction.category = :category', { category });
    }

    // 2. Sorting
    if (sort === 'date_desc') {
      query.orderBy('transaction.date', 'DESC');
    } else if (sort === 'date_asc') {
      query.orderBy('transaction.date', 'ASC');
    } else {
      // Default sort (e.g., by created_at)
      query.orderBy('transaction.created_at', 'DESC');
    }

    return await query.getMany();
  }
}
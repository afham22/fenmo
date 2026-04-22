import { Module } from '@nestjs/common';
import { ExpenseController } from './expense.controller';
import { ExpenseService } from './expense.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../utilities/models/transaction-model';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [ExpenseController],
  providers: [ExpenseService],
})
export class ExpenseModule {}

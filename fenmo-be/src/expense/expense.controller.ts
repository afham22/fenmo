import { 
  Controller, 
  Post, 
  Body, 
  UsePipes, 
  ValidationPipe, 
  UseFilters, 
  Query,
  Get
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from '../utilities/dto/create-expense-dto';
import { HttpExceptionFilter } from '../utilities/filters/http-exception-filter';
import { GetExpensesQueryDto } from 'src/utilities/dto/get-expense-dto';

@Controller('expenses')
@UseFilters(new HttpExceptionFilter()) // Apply our custom error formatting
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body() createExpenseDto: CreateExpenseDto) {
    return await this.expenseService.create(createExpenseDto);
  }

  @Get()
  async getExpenses(
    @Query(new ValidationPipe({ transform: true }))
    queryDto: GetExpensesQueryDto,
  ) {
    return await this.expenseService.findAll(queryDto);
  }
}


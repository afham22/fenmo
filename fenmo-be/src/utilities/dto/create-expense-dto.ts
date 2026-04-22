import { IsNumber, IsPositive, IsString, IsNotEmpty, IsDateString, IsUUID, IsOptional } from 'class-validator';

export class CreateExpenseDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsDateString()
  date: string;

  @IsUUID()
  @IsNotEmpty()
  // to identify this specific attempt
  idempotencyKey: string; 
}
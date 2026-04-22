import { IsNumber, IsPositive, IsString, IsNotEmpty, IsDateString, IsUUID, IsOptional, MaxLength, Matches } from 'class-validator';

export class CreateExpenseDto {
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Amount must have at most 2 decimal places' })
  @IsPositive({ message: 'Amount must be greater than 0' })
  amount: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsOptional()
  @MaxLength(256, { message: 'Description cannot exceed 256 characters' })
  description: string;

  @IsDateString()
  date: string;

  @IsUUID()
  @IsNotEmpty()
  // to identify this specific attempt
  idempotencyKey: string; 
}
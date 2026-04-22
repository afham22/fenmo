import { IsOptional, IsString, IsIn, Matches } from 'class-validator';

export class GetExpensesQueryDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsIn(['date_desc', 'date_asc'])
  sort?: string;

  @IsOptional()
  @Matches(/^(0[1-9]|1[0-2])$/, { message: 'month must be between 01 and 12' })
  month?: string;

  @IsOptional()
  @Matches(/^\d{4}$/, { message: 'year must be a 4-digit number' })
  year?: string;
}
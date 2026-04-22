import { IsOptional, IsString, IsIn } from 'class-validator';

export class GetExpensesQueryDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsIn(['date_desc', 'date_asc'])
  sort?: string;
}
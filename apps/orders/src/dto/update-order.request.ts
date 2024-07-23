import {
  IsOptional,
  IsPositive,
  IsString,
  IsPhoneNumber,
} from 'class-validator';

export class UpdateOrderRequest {
  @IsString()
  @IsOptional()
  name?: string;

  @IsPositive()
  @IsOptional()
  price?: number;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;
}

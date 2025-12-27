import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { CustomerStatus } from '@prisma/client';

export class CreateCustomerDto {
    @ApiProperty({ maxLength: 80 })
    @IsString()
    @MaxLength(80)
    firstName: string;

    @ApiProperty({ maxLength: 80 })
    @IsString()
    @MaxLength(80)
    lastName: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ maxLength: 40 })
    @IsOptional()
    @IsString()
    @MaxLength(40)
    phone?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    companyName?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    vatNumber?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    website?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    address?: string;

    @ApiPropertyOptional({ maxLength: 1000 })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string;

    @ApiPropertyOptional({ enum: CustomerStatus })
    @IsOptional()
    @IsEnum(CustomerStatus)
    status?: CustomerStatus;
}

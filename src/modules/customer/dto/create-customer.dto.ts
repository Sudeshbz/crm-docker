import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { CustomerStatus } from '@prisma/client';

export class CreateCustomerDto {
    @ApiProperty({ maxLength: 160 })
    @IsString()
    @MaxLength(160)
    fullName: string;

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

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    designation?: string;

    @ApiPropertyOptional({ enum: CustomerStatus })
    @IsOptional()
    @IsEnum(CustomerStatus)
    status?: CustomerStatus;
}

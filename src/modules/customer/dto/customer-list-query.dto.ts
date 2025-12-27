import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsIn } from 'class-validator';
import { CustomerStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class CustomerListQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional({
        enum: ['createdAt', 'updatedAt', 'firstName', 'lastName'],
        example: 'createdAt',
    })
    @IsOptional()
    @IsIn(['createdAt', 'updatedAt', 'firstName', 'lastName'])
    sortBy?: 'createdAt' | 'updatedAt' | 'firstName' | 'lastName';

    @ApiPropertyOptional({
        enum: ['asc', 'desc'],
        example: 'desc',
    })
    @IsOptional()
    @IsIn(['asc', 'desc'])
    order?: 'asc' | 'desc';

    @ApiPropertyOptional({ enum: CustomerStatus })
    @IsOptional()
    @IsEnum(CustomerStatus)
    status?: CustomerStatus;

    @ApiPropertyOptional({ example: 'ali' })
    @IsOptional()
    @IsString()
    search?: string;
}

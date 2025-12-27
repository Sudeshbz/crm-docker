import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerListQueryDto } from './dto/customer-list-query.dto';

@ApiTags('Customer')
@ApiBearerAuth('JWT-auth')
@Controller('customers')
export class CustomerController {
    constructor(private readonly service: CustomerService) { }

    @Post()
    create(@Body() dto: CreateCustomerDto, @Req() req) {
        return this.service.create(dto, req.user);
    }

    @Get()
    list(@Query() query: CustomerListQueryDto, @Req() req) {
        return this.service.list(query, req.user);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateCustomerDto,
        @Req() req,
    ) {
        return this.service.update(id, dto, req.user);
    }

    @Delete(':id')
    delete(@Param('id') id: string, @Req() req) {
        return this.service.delete(id, req.user);
    }
}

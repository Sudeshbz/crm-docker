import {
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { CustomerRepository } from './customer.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { CustomerStatus } from './enums/customer-status.enum';
import { CustomerListQueryDto } from './dto/customer-list-query.dto';

@Injectable()
export class CustomerService {
    constructor(
        private readonly repo: CustomerRepository,
        private readonly prisma: PrismaService,
    ) { }

    async create(
        dto: CreateCustomerDto,
        user: any,
    ): Promise<CustomerResponseDto> {
        const organizationId = user.organizationId;

        if (!organizationId) {
            throw new UnauthorizedException(
                'organizationId missing in token payload',
            );
        }

        if (dto.email) {
            const exists = await this.repo.existsByEmail(
                organizationId,
                dto.email,
            );
            if (exists) {
                throw new ConflictException(
                    'Email already exists in organization',
                );
            }
        }

        const customer = await this.repo.create({
            organization: { connect: { id: organizationId } },
            owner: { connect: { id: user.userId } },

            fullName: dto.fullName,
            email: dto.email,
            phone: dto.phone,
            companyName: dto.companyName,
            vatNumber: dto.vatNumber,
            website: dto.website,
            address: dto.address,
            description: dto.description,
            designation: dto.designation,

            status: dto.status ?? CustomerStatus.NEW,
        });

        return this.toResponse(customer);
    }

    async update(
        id: string,
        dto: UpdateCustomerDto,
        user: any,
    ): Promise<CustomerResponseDto> {
        const organizationId = user.organizationId;

        if (!organizationId) {
            throw new UnauthorizedException(
                'organizationId missing in token payload',
            );
        }

        const current = await this.repo.findByIdAndOrg(id, organizationId);
        if (!current) {
            throw new NotFoundException('Customer not found');
        }

        if (dto.email) {
            const exists = await this.repo.existsByEmail(
                organizationId,
                dto.email,
                id,
            );
            if (exists) {
                throw new ConflictException(
                    'Email already exists in organization',
                );
            }
        }

        const updated = await this.repo.updateSafe(id, organizationId, {
            fullName: dto.fullName,
            email: dto.email,
            phone: dto.phone,
            companyName: dto.companyName,
            vatNumber: dto.vatNumber,
            website: dto.website,
            address: dto.address,
            description: dto.description,
            designation: dto.designation,
            status: dto.status,
        });

        if (!updated) {
            throw new NotFoundException('Customer not found');
        }

        return this.toResponse(updated);
    }

    async delete(id: string, user: any): Promise<void> {
        const organizationId = user.organizationId;

        if (!organizationId) {
            throw new UnauthorizedException(
                'organizationId missing in token payload',
            );
        }

        const deleted = await this.repo.softDeleteSafe(id, organizationId);
        if (!deleted) {
            throw new NotFoundException('Customer not found');
        }

        // Customer silinince task bağlantılarını kopar
        await this.prisma.task.updateMany({
            where: { customerId: id },
            data: { customerId: null },
        });
    }

    async list(query: CustomerListQueryDto, user: any) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;

        const { items, total } = await this.repo.list({
            page,
            limit,
            sortBy: query.sortBy ?? 'createdAt',
            order: query.order === 'asc' ? 'asc' : 'desc',
            organizationId: user.organizationId,
            status: query.status,
            search: query.search,
        });

        return {
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            data: items.map((c) => this.toResponse(c)),
        };
    }

    private toResponse(c: any): CustomerResponseDto {
        return {
            id: c.id,
            fullName: c.fullName,
            email: c.email,
            phone: c.phone,
            companyName: c.companyName,
            status: c.status,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
        };
    }
}

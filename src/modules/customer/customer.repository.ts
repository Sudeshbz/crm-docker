import { Injectable } from '@nestjs/common';
import { Prisma, Customer } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export type CustomerListParams = {
    organizationId: string;
    status?: string;
    search?: string;
    page: number;
    limit: number;
    sortBy: 'createdAt' | 'updatedAt' | 'fullName';
    order: 'asc' | 'desc';
};

@Injectable()
export class CustomerRepository {
    constructor(private readonly prisma: PrismaService) { }

    create(data: Prisma.CustomerCreateArgs['data']) {
        return this.prisma.customer.create({ data });
    }

    findById(id: string) {
        return this.prisma.customer.findFirst({
            where: { id, deletedAt: null },
        });
    }

    findByIdAndOrg(id: string, organizationId: string) {
        return this.prisma.customer.findFirst({
            where: { id, organizationId, deletedAt: null },
        });
    }

    async updateSafe(
        id: string,
        organizationId: string,
        data: Prisma.CustomerUpdateArgs['data'],
    ) {
        const result = await this.prisma.customer.updateMany({
            where: { id, organizationId, deletedAt: null },
            data,
        });

        if (result.count === 0) return null;
        return this.findByIdAndOrg(id, organizationId);

    }

    async softDeleteSafe(id: string, organizationId: string) {
        const result = await this.prisma.customer.updateMany({
            where: { id, organizationId, deletedAt: null },
            data: { deletedAt: new Date() },
        });

        return result.count > 0;
    }

    async existsByEmail(
        organizationId: string,
        email: string,
        excludeId?: string,
    ): Promise<boolean> {
        const found = await this.prisma.customer.findFirst({
            where: {
                organizationId,
                email,
                deletedAt: null,
                ...(excludeId ? { id: { not: excludeId } } : {}),
            },
        });

        return !!found;
    }


    async list(params: CustomerListParams): Promise<{ items: Customer[]; total: number }> {
        const { organizationId, status, search, page, limit, sortBy, order } = params;

        const where: Prisma.CustomerWhereInput = { deletedAt: null };

        if (organizationId) where.organizationId = organizationId;
        if (status) where.status = status as any;

        if (search) {
            where.OR = [
                { fullName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [items, total] = await this.prisma.$transaction([
            this.prisma.customer.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { [sortBy]: order },
            }),
            this.prisma.customer.count({ where }),
        ]);

        return { items, total };
    }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const result = await this.prisma.$transaction(async (tx) => {
            const organization = await tx.organization.create({
                data: {
                    name: `${dto.username} Organization`,
                    slug: dto.username.toLowerCase(),
                    organizationType: 'COMPANY',
                    planType: 'FREE',
                    isActive: true,
                    ownerUserId: 'TEMP',
                },
            });

            const user = await tx.user.create({
                data: {
                    username: dto.username,
                    email: dto.email,
                    password: hashedPassword,
                    role: Role.USER,
                    organizationId: organization.id,
                },
            });

            await tx.organization.update({
                where: { id: organization.id },
                data: { ownerUserId: user.id },
            });

            return { user, organizationId: organization.id };
        });

        return {
            accessToken: this.createAccessToken({
                id: result.user.id,
                username: result.user.username,
                role: result.user.role,
                organizationId: result.organizationId,
            }),
            refreshToken: await this.createRefreshToken(result.user.id),
        };
    }

    async authenticate(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { username: dto.username },
        });

        if (!user) throw new UnauthorizedException('Invalid credentials');

        const match = await bcrypt.compare(dto.password, user.password);
        if (!match) throw new UnauthorizedException('Invalid credentials');

        if (!user.organizationId) {
            throw new UnauthorizedException('User has no organization');
        }

        return {
            accessToken: this.createAccessToken({
                id: user.id,
                username: user.username,
                role: user.role,
                organizationId: user.organizationId,
            }),
            refreshToken: await this.createRefreshToken(user.id),
        };
    }

    async refresh(dto: RefreshTokenDto) {
        const token = await this.prisma.refreshToken.findUnique({
            where: { refreshToken: dto.refreshToken },
            include: { user: true },
        });

        if (!token || token.expiredAt < new Date()) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        return {
            accessToken: this.createAccessToken({
                id: token.user.id,
                username: token.user.username,
                role: token.user.role,
                organizationId: token.user.organizationId,
            }),
            refreshToken: await this.createRefreshToken(token.user.id),
        };
    }

    async logout(userId: string) {
        await this.prisma.refreshToken.deleteMany({ where: { userId } });
    }

    private createAccessToken(user: { id: string; username: string; role: Role; organizationId: string }) {
        return this.jwt.sign(
            {
                sub: user.id,
                username: user.username,
                role: user.role,
                organizationId: user.organizationId,
            },
            { expiresIn: '2h' },
        );
    }

    private async createRefreshToken(userId: string) {
        await this.prisma.refreshToken.deleteMany({ where: { userId } });

        const token = randomUUID();
        await this.prisma.refreshToken.create({
            data: {
                refreshToken: token,
                expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 4),
                userId,
            },
        });

        return token;
    }
}

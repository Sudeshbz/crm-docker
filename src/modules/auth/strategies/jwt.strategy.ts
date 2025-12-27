import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        console.log('JWT_SECRET IN STRATEGY:', process.env.JWT_SECRET);

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        });
    }


    validate(payload: any) {
        return {
            userId: payload.sub,
            username: payload.username,
            role: payload.role,
            organizationId: payload.organizationId, // ✅ EKLE
        };
    }


}

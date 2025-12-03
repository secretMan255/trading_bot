import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService) {
        const secret = config.get<string>('JWT_SECRET');
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }

        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => req?.cookies?.['liangliang_access_token'] || null,
                (req: Request) => {
                    const auth = req?.headers?.authorization;
                    if (!auth) return null;
                    const [type, token] = auth.split(' ');
                    if (type === 'Bearer' && token) return token;
                    return null;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: secret,
        });
    }

    async validate(payload: any) {
        return { id: payload.id, name: payload.name, permission: payload.permission || [] };
    }
}

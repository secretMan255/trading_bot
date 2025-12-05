import { Module } from '@nestjs/common'
import { WebhookController } from './webhook.controller'
import { BitgetService } from './bitget.service'
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/guard/auth/jwt.guard';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const secret = config.get<string>('JWT_SECRET');
                if (!secret) throw new Error('JWT_SECRET is not defined');
                return {
                    secret,
                    signOptions: { expiresIn: '1h' },
                };
            },
        }), ConfigModule],
    controllers: [WebhookController],
    providers: [BitgetService, JwtStrategy],
    exports: [BitgetService]
})
export class WebhookModule { }

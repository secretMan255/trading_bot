import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import dbConfig from '../config/mysql.config'
import { AppCronService } from 'src/app.cron.service';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { BitgetModule } from 'src/modules/bitget/bitget.model';

@Module({
    imports: [
        ConfigModule.forFeature(dbConfig),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (cfg: ConfigService) => {
                const db = cfg.get('db')
                return {
                    ...db,
                    retryAttempts: 5,
                    retryDelay: 3000,
                };
            },
        }),
        BitgetModule
    ],
    controllers: [AppController],
    providers: [
        AppService,
        AppCronService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
    ]
})
export class MysqlModule { }
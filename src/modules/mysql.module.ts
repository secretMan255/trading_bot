import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import dbConfig from '../config/mysql.config'
import { SupportLevelEntity } from 'src/entities';

@Module({
    imports: [
        ConfigModule.forFeature(dbConfig),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (cfg: ConfigService) => {
                const db = cfg.get('db');
                return {
                    entities: [SupportLevelEntity],
                    ...db,
                    retryAttempts: 5,
                    retryDelay: 3000,
                };
            },
        })
    ],
    exports: [TypeOrmModule]
})
export class MysqlModule { }
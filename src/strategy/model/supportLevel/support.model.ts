import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SupportLevelEntity } from 'src/entities';
import { SupportLevelRepository } from './support.repository';
import { SupportService } from './support.level.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BitgetModule } from '../../../modules/bitget/bitget.model';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        TypeOrmModule.forFeature([SupportLevelEntity]),
        BitgetModule
    ],
    providers: [
        SupportLevelRepository,
        SupportService,
        // strategy service
    ],
    exports: [
        SupportLevelRepository,
        SupportService
    ]
})
export class SupportLevelModule { }

import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { BitgetService } from 'src/modules/bitget/bitget.service'
import { SupportLevelRepository } from '../repository/support.repository'
import { findSupportLevels } from '../strategy.utils'

@Injectable()
export class SupportStrategyService {
    constructor(
        private readonly bitgetService: BitgetService,
        private readonly supportRepo: SupportLevelRepository
    ) { }


}
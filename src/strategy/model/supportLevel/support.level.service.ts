import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { BitgetService } from 'src/modules/bitget/bitget.service'
import { SupportLevelRepository } from './support.repository'
import { findSupportLevels } from '../../strategy.utils'

@Injectable()
export class SupportService {
    constructor(
        private readonly bitgetService: BitgetService,
        private readonly supportRepo: SupportLevelRepository
    ) { }

    private symbols: string[] = ['BTCUSDT', 'ETHUSDT']

    private async updateForTimeFrame(symbol: string, timeframe: '1h' | '4h' | '1d', granularity: number, limit: number, levelType: 1 | 2 | 3) {
        const candles = await this.bitgetService.getFutureCandles(symbol, granularity, limit)
        const levels = findSupportLevels(candles, 0.003, 3)

        await this.supportRepo.replaceLevels(symbol, timeframe, levelType, levels)
        console.log(`Updated supports: ${symbol} ${timeframe} -> ${levels.length} levels`)
    }

    // Every day
    @Cron(CronExpression.EVERY_DAY_AT_1AM)
    async updateDailySupports() {
        for (const symbol of this.symbols) {
            await this.updateForTimeFrame(symbol, '1d', 86400, 365, 1)
        }
    }

    // Every 4 hour
    @Cron(CronExpression.EVERY_DAY_AT_4AM)
    async update4HSupports() {
        for (const symbol of this.symbols) {
            await this.updateForTimeFrame(symbol, '4h', 14400, 500, 2)
        }
    }

    // Every 30 min
    @Cron(CronExpression.EVERY_30_MINUTES)
    async update1HSupports() {
        for (const symbol of this.symbols) {
            await this.updateForTimeFrame(symbol, '1h', 3600, 500, 3)
        }
    }

}   
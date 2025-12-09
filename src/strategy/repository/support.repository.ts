import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportLevelEntity } from 'src/entities';
import { SupportLevel } from '../strategy.utils';

@Injectable()
export class SupportLevelRepository {
    constructor(
        @InjectRepository(SupportLevelEntity)
        private readonly supportLevelRepo: Repository<SupportLevelEntity>
    ) { }

    async replaceLevels(symbol: string, timeframe: '1h' | '4h' | '1d', levelType: 1 | 2 | 3, levels: SupportLevel[]) {
        await this.supportLevelRepo.delete({ symbol, timeframe })

        if (!levels.length) return

        const rows = levels.map((l) =>
            this.supportLevelRepo.create({
                symbol,
                timeframe,
                level_type: levelType,
                price: l.price.toString(),
                lower: l.lower.toString(),
                upper: l.upper.toString(),
                touches: l.touches,
                last_touch: new Date(l.lastTouchedAt),
                status: 1
            })
        )

        await this.supportLevelRepo.save(rows)
    }

    /**
     * Find the most nearest and still valid support level (within a certain time frame) for the current price
     * @param symbol  Token symbol (BTCUSDT, ETHUSDT)
     * @param timeframe Withn a certain time frame
     * @param price Find out the most nearest price
     */
    async findNearestSupport(symbol: string, timeframe: '1h' | '4h' | '1d', price: number) {
        const lists = await this.supportLevelRepo.find({
            where: { symbol, timeframe, status: 1 }
        })

        if (!lists.length) return null

        let best: SupportLevelEntity | null = null
        let bestDiff = Number.MAX_VALUE

        for (const list of lists) {
            const previousPrice = Number(list.price)
            const diff = Math.abs(previousPrice - price)

            if (diff < bestDiff) {
                bestDiff = diff
                best = list
            }
        }

        return best
    }
}
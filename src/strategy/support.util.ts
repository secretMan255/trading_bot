export interface Candle {
    ts: number
    open: number
    high: number
    low: number
    close: number
    volume: number
}

export interface SupportLevel {
    price: number
    lower: number
    upper: number
    touches: number
    lastTouchedAt: number
}

/**
 * find support from K line
 * @param candles  Candlestick chart array (sorted by time from oldest to newest)
 * @param tolerancePct Price tolerance for aggregation error percentage (0.003 = 0.3%)
 * @param minTouches Minimum number of touches
 */
export function findSupportLevels(
    candles: Candle[],
    tolerancePct = 0.003,
    minTouches = 3
): SupportLevel[] {
    const swings: { price: number; ts: number }[] = []

    // 1. find swing low
    for (let i = 1;i < candles.length - 1;i++) {
        const prev: Candle = candles[i - 1]
        const cur: Candle = candles[i]
        const next: Candle = candles[i + 1]

        if (cur.low < prev.low && cur.low < next.low) swings.push({ price: cur.low, ts: cur.ts })
    }

    // 2. get lower price into object (support level)
    const levels: SupportLevel[] = []

    for (const swing of swings) {
        let matched: boolean = false

        for (const level of levels) {
            const diffPct: number = Math.abs(swing.price - level.price) / level.price

            if (diffPct <= tolerancePct) {
                level.price = (level.price * level.touches + swing.price) / (level.touches + 1)
                level.lower = Math.min(level.lower, swing.price)
                level.upper = Math.max(level.upper, swing.price)
                level.touches += 1
                level.lastTouchedAt = Math.max(level.lastTouchedAt, swing.ts)
                matched = true
                break
            }
        }

        if (!matched) {
            levels.push({
                price: swing.price,
                lower: swing.price,
                upper: swing.price,
                touches: 1,
                lastTouchedAt: swing.ts
            })
        }
    }

    // 3. filter out those with too few touches
    return levels.filter((level) => level.touches >= minTouches).sort((a, b) => a.price - b.price)
}
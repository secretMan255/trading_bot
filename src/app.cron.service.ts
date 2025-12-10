import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BitgetService } from './modules/bitget/bitget.service';

@Injectable()
export class AppCronService {
    private readonly logger = new Logger(AppCronService.name)

    constructor(
        private readonly bitgetService: BitgetService
    ) { }

    @Cron('*/10 * * * * *', { name: 'BTC Ticker' })
    async BTCSpotTicker() {
        const spot = await this.bitgetService.getSpotTikets('BTCUSDT')
        this.logger.log('BTC Spot Ticker: ')
        console.log('24H High: ', spot.data[0].high24h)
        console.log('24H Low: ', spot.data[0].low24h)
        console.log('24H Change: ', spot.data[0].change24h)
        console.log('Last Price: ', spot.data[0].lastPr)

        const future = await this.bitgetService.getFutureTicker('USDT-FUTURES', 'BTCUSDT')
        this.logger.log('BTC Future Ticker: ')
        console.log('24H HIgh: ', future.data[0].high24h)
        console.log('24H Low: ', future.data[0].low24h)
        console.log('24H Change: ', future.data[0].change24h)
        console.log('Last Price: ', future.data[0].lastPr)

    }

    @Cron('*/10 * * * * *', { name: 'ETH Ticker' })
    async ETHSpoTicker() {
        const spot = await this.bitgetService.getSpotTikets('ETHUSDT')
        this.logger.log('ETH Spot Ticker: ')
        console.log('24H High: ', spot.data[0].high24h)
        console.log('24H Low: ', spot.data[0].low24h)
        console.log('24H Change: ', spot.data[0].change24h)
        console.log('Last Price: ', spot.data[0].lastPr)


        const future = await this.bitgetService.getFutureTicker('USDT-FUTURES', 'ETHUSDT')
        this.logger.log('ETH Future Ticker: ')
        console.log('24H HIgh: ', future.data[0].high24h)
        console.log('24H Low: ', future.data[0].low24h)
        console.log('24H Change: ', future.data[0].change24h)
        console.log('Last Price: ', future.data[0].lastPr)
    }

    @Cron('59 * * * * *')
    async Test() {
        this.logger.log('Account Balance: ')
        const res = await this.bitgetService.getAccountOverall()
        console.log(res)
    }

    // @Cron('*/5 * * * * *')
    // async oneHourSuppoerLevel() {
    //     const symbols: string[] = ['BTCUSDT', 'ETHUSDT']

    //     for (const symbol of symbols) {
    //         const res = await this.bitgetService.getFutureCandles(symbol, 3600)
    //         this.logger.log(`1H ${symbol} Support Level`)
    //         console.log(res)
    //     }
    // }
}
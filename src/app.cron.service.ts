import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BitgetService } from './webhook/bitget.service';

@Injectable()
export class AppCronService {
    private readonly logger = new Logger(AppCronService.name)

    constructor(
        private readonly bitgetService: BitgetService
    ) { }

    @Cron('* 1 * * * *', { name: 'account overall' })
    async AccountOverall() {
        const accountOverall = await this.bitgetService.getAccountOverall()
        // console.log('account: ', accountOverall)
    }

    @Cron('59 * * * * *', { name: 'BTC Ticker' })
    async BTCSpotTicker() {
        const spot = await this.bitgetService.getSpotTikets('BTCUSDT')
        this.logger.log('BTC Spot Ticker: ')
        console.log('24H High: ', spot.data[0].high24h)
        console.log('24H Low: ', spot.data[0].low24h)
        console.log('24H Change: ', spot.data[0].change24h)
        console.log('Last Price: ', spot.data[0].lastPr)

        const future = await this.bitgetService.getFutureTicker('USDT-FUTURES', 'BTCUSDM24')
        this.logger.log('BTC Future Ticker: ')
        console.log('24H HIgh: ', future.data[0].high24h)
        console.log('24H Low: ', future.data[0].low24h)
        console.log('24H Change: ', future.data[0].change24h)
        console.log('Last Price: ', future.data[0].lastPr)

    }

    @Cron('59 * * * * *', { name: 'ETH Ticker' })
    async ETHSpoTicker() {
        const spot = await this.bitgetService.getSpotTikets('ETHUSDT')
        this.logger.log('ETH Spot Ticker: ')
        console.log('24H High: ', spot.data[0].high24h)
        console.log('24H Low: ', spot.data[0].low24h)
        console.log('24H Change: ', spot.data[0].change24h)
        console.log('Last Price: ', spot.data[0].lastPr)


        const future = await this.bitgetService.getFutureTicker('USDT-FUTURES', 'ETHUSDM24')
        this.logger.log('ETH Future Ticker: ')
        console.log('24H HIgh: ', future.data[0].high24h)
        console.log('24H Low: ', future.data[0].low24h)
        console.log('24H Change: ', future.data[0].change24h)
        console.log('Last Price: ', future.data[0].lastPr)
    }
}